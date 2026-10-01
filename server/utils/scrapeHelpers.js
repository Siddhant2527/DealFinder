const axios = require('axios');
const cheerio = require('cheerio');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const IGNORE_QUERY_WORDS = new Set(['best', 'deal', 'price', 'prices', 'search', 'buy', 'online', 'india', 'in']);
const MODEL_VARIANTS = new Set(['mini', 'pro', 'plus', 'max', 'ultra', 'fe', 'fold', 'flip', 'lite']);
const ELECTRONICS_QUERY = /\b(phone|smartphone|iphone|ipad|tablet|mobile|galaxy|pixel|laptop|notebook|macbook|computer|pc|desktop|tv|television|smart\s*tv|headphones?|earbuds?|earphones?|airpods?|buds|speaker|soundbar|camera|mirrorless|dslr|smartwatch|watch|console|playstation|ps[345]|xbox|nintendo|gaming|monitor|projector|graphics?\s*card|gpu|rtx|gtx|radeon|processor|cpu|ryzen|kindle|e-?reader|drone|vr\s*headset|wh-\d{4}|samsung\s+(?:[a-z]?\d|z\s*(?:flip|fold)))\b/i;
const ELECTRONICS_PRODUCT = /\b(phone|smartphone|iphone|ipad|tablet|mobile|galaxy|pixel|laptop|notebook|macbook|computer|desktop|tv|television|smart\s*tv|headphones?|earbuds?|earphones?|airpods?|buds|speaker|soundbar|camera|mirrorless|dslr|smartwatch|playstation|ps[345]|xbox|nintendo|gaming\s*console|monitor|projector|graphics?\s*card|gpu|rtx|gtx|radeon|processor|router|printer|kindle|e-?reader|drone|vr\s*headset|wh-\d{4})\b/i;
const ACCESSORY_PRODUCT = /\b(case|cover|screen protector|tempered glass|charger|charging cable|usb cable|adapter|stand|mount|replacement battery|protective film|sleeve|skin)\b/i;
const RETAILERS = [
  {
    name: 'Amazon',
    host: 'amazon.in',
    searchUrl: query => `https://www.amazon.in/s?k=${encodeURIComponent(query)}`,
    selectors: ['div[data-component-type="s-search-result"]'],
    title: node => node.find('h2 a span').first().text().trim() || node.find('img.s-image').first().attr('alt'),
    price: node => node.find('.a-price .a-offscreen').first().text() || node.find('.a-price-whole').first().text(),
    rating: node => node.find('span.a-icon-alt').first().text(),
    image: node => node.find('img.s-image').first().attr('src'),
    link: node => node.find('h2 a').first().attr('href') || node.find('a[href*="/dp/"]').first().attr('href'),
  },
  {
    name: 'Flipkart',
    host: 'flipkart.com',
    searchUrl: query => `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`,
    selectors: ['div.jIjQ8S', 'div[data-id]'],
    title: node => node.find('a[title]').first().attr('title') || node.find('div._4rR01T, a.s1Q9rs').first().text() || node.find('img[alt]').first().attr('alt'),
    price: node => node.text(),
    rating: node => node.find('div._3LWZlK').first().text(),
    image: node => node.find('img').first().attr('src'),
    link: node => node.find('a[href]').first().attr('href'),
  },
  {
    name: 'Croma',
    host: 'croma.com',
    searchUrl: query => `https://www.croma.com/searchB?q=${encodeURIComponent(query)}`,
    selectors: ['li.product-item', '.product-item', '[data-testid*="product"]'],
    title: node => node.find('.product-title, .product-item-link, h3, h2, [class*="title"]').first().text().trim(),
    price: node => node.find('.amount, .price, [class*="price"]').first().text(),
    rating: node => node.find('[class*="rating"]').first().text(),
    image: node => node.find('img').first().attr('src') || node.find('img').first().attr('data-src'),
    link: node => node.find('a[href]').first().attr('href'),
  },
  {
    name: 'Reliance Digital',
    host: 'reliancedigital.in',
    searchUrl: query => `https://www.reliancedigital.in/search?q=${encodeURIComponent(query)}`,
    selectors: ['li.product-item', '.product-item', '[class*="product-card"]', '[data-testid*="product"]'],
    title: node => node.find('.sp__name, .product-name, h3, h2, [class*="name"]').first().text().trim(),
    price: node => node.find('.sp__price, .price, [class*="price"]').first().text(),
    rating: node => node.find('[class*="rating"]').first().text(),
    image: node => node.find('img').first().attr('src') || node.find('img').first().attr('data-src'),
    link: node => node.find('a[href]').first().attr('href'),
  },
  {
    name: 'iStore',
    host: 'istore.co.in',
    searchUrl: query => `https://www.istore.co.in/catalogsearch/result/?q=${encodeURIComponent(query)}`,
    selectors: ['li.product-item', '.product-item', '[class*="product-card"]'],
    title: node => node.find('.product-item-link, .product-title, h3, h2').first().text().trim(),
    price: node => node.find('.price, [class*="price"]').first().text(),
    rating: node => node.find('[class*="rating"]').first().text(),
    image: node => node.find('img').first().attr('src') || node.find('img').first().attr('data-src'),
    link: node => node.find('a[href]').first().attr('href'),
  },
];

function normalizeText(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function isElectronicsQuery(query) {
  return ELECTRONICS_QUERY.test(query);
}

function isElectronicsProduct(name) {
  return ELECTRONICS_PRODUCT.test(name) && !ACCESSORY_PRODUCT.test(name);
}

function matchesQuery(name, query) {
  const queryWords = normalizeText(query)
    .split(/\s+/)
    .filter(word => word.length > 1 && !IGNORE_QUERY_WORDS.has(word));
  const productName = normalizeText(name).replace(/\s+/g, '');
  const requiredNumbers = queryWords.filter(word => /\d/.test(word));
  if (!requiredNumbers.every(word => productName.includes(word))) return false;

  if (requiredNumbers.length) {
    const productWords = normalizeText(name).split(/\s+/);
    if (productWords.some(word => MODEL_VARIANTS.has(word) && !queryWords.includes(word))) return false;
  }

  const keywords = queryWords.filter(word => !/\d/.test(word));
  if (!keywords.length) return requiredNumbers.length > 0;
  const matchedCount = keywords.filter(word => productName.includes(word)).length;
  return matchedCount >= Math.ceil(keywords.length * 0.6);
}

function parsePrice(value) {
  const raw = String(value || '').trim();
  const match = raw.match(/₹\s*([\d,]+(?:\.\d+)?)/) || (/^[\d,.]+$/.test(raw) ? raw.match(/[\d,.]+/) : null);
  return match ? Math.round(Number((match[1] || match[0]).replace(/,/g, ''))) : 0;
}

function parseRating(value) {
  const match = String(value || '').match(/\d(?:\.\d)?/);
  return match ? Number(match[0]) : null;
}

function absoluteUrl(value, baseUrl, host) {
  if (!value) return '';
  try {
    const url = new URL(value, baseUrl);
    return url.hostname === host || url.hostname.endsWith(`.${host}`) ? url.href : '';
  } catch {
    return '';
  }
}

function scrapeProductCards($, retailer, searchUrl, query) {
  const products = [];
  const seenLinks = new Set();

  for (const selector of retailer.selectors) {
    $(selector).each((index, element) => {
      const node = $(element);
      const name = String(retailer.title(node) || '').replace(/^Sponsored Ad\s*-\s*/i, '').replace(/\s+/g, ' ').trim();
      const price = parsePrice(retailer.price(node));
      const link = absoluteUrl(retailer.link(node), searchUrl, retailer.host);
      if (!name || !price || !link || !isElectronicsProduct(name) || !matchesQuery(name, query) || seenLinks.has(link)) return;
      seenLinks.add(link);
      const imageValue = retailer.image(node);
      const image = imageValue && imageValue.startsWith('//') ? `https:${imageValue}` : imageValue || '';
      products.push({
        id: `${retailer.name.toLowerCase().replace(/\W+/g, '-')}-${products.length}`,
        platform: retailer.name,
        name,
        price,
        rating: parseRating(retailer.rating(node)),
        image,
        link,
      });
    });
    if (products.length >= 6) break;
  }

  return products.slice(0, 6);
}

async function scrapeRetailer(retailer, query) {
  const searchUrl = retailer.searchUrl(query);
  try {
    const { data } = await axios.get(searchUrl, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-IN,en;q=0.9',
      },
      timeout: 12000,
      maxRedirects: 5,
    });
    const $ = cheerio.load(data);
    const results = scrapeProductCards($, retailer, searchUrl, query);
    const hasProductCards = retailer.selectors.some(selector => $(selector).length > 0);
    return {
      results,
      status: results.length ? 'live' : hasProductCards ? 'no-results' : 'unavailable',
    };
  } catch (error) {
    console.warn(`${retailer.name} search unavailable: ${error.message}`);
    return { results: [], status: 'unavailable' };
  }
}

async function searchRetailers(query) {
  const responses = await Promise.all(RETAILERS.map(retailer => scrapeRetailer(retailer, query)));
  const results = responses.flatMap(response => response.results)
    .sort((a, b) => a.price - b.price);
  const retailers = RETAILERS.map((retailer, index) => ({
    name: retailer.name,
    status: responses[index].status,
    count: responses[index].results.length,
    searchUrl: retailer.searchUrl(query),
  }));

  return { results, retailers };
}

module.exports = {
  isElectronicsQuery,
  searchRetailers,
};
