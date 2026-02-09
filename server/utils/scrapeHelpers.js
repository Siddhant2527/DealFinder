const axios = require('axios');
const cheerio = require('cheerio');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';

/**
 * Scrape Flipkart search results for a given query.
 * Returns an array of product objects with price, rating, image, delivery info.
 */
async function scrapeFlipkart(query) {
  const searchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;
  const products = [];
  try {
    const { data } = await axios.get(searchUrl, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: 10000,
    });
    const $ = cheerio.load(data);

    // Flipkart search result selectors (stable as of 2024)
    $('div[data-id]').each((i, el) => {
      const $el = $(el);
      const name = $el.find('a[title]').attr('title')?.trim() || $el.find('div._4rR01T').text().trim();
      const link = 'https://www.flipkart.com' + ($el.find('a[href]').attr('href') || '');
      const image = $el.find('img[src]').attr('src') || '';
      const priceText = $el.find('div._30jeq3').text().replace(/[₹,]/g, '');
      const price = parseInt(priceText, 10) || 0;
      const ratingText = $el.find('div._3LWZlK').text().trim();
      const rating = parseFloat(ratingText) || 0;
      const deliveryText = $el.find('span._1TPvTK').text().toLowerCase();
      const delivery = deliveryText.includes('tomorrow') ? 1 : deliveryText.includes('day') ? parseInt(deliveryText.match(/(\d+)/)?.[0], 10) || 3 : 3;

      if (name && price > 0) {
        products.push({
          id: `flipkart_${i}`,
          platform: 'Flipkart',
          name,
          price,
          rating,
          delivery,
          image,
          link,
          logo: '🛒',
        });
      }
    });
  } catch (err) {
    console.error('Flipkart scrape error:', err.message);
  }
  return products.slice(0, 5); // top 5 results
}

/**
 * Scrape Amazon search results for a given query.
 * Returns an array of product objects with price, rating, image, delivery info.
 */
async function scrapeAmazon(query) {
  const searchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;
  const products = [];
  try {
    const { data } = await axios.get(searchUrl, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: 10000,
    });
    const $ = cheerio.load(data);

    // Amazon search result selectors (stable as of 2024)
    $('div[data-component-type="s-search-result"]').each((i, el) => {
      const $el = $(el);
      const name = $el.find('h2 a span').text().trim();
      const link = 'https://www.amazon.in' + ($el.find('h2 a').attr('href') || '');
      const image = $el.find('img.s-image').attr('src') || '';
      const priceWhole = $el.find('span.a-price-whole').text().replace(/[₹,]/g, '');
      // Use rupee integer for price to keep consistency with Flipkart
      const price = parseInt(priceWhole, 10) || 0;
      const ratingText = $el.find('span.a-icon-alt').text();
      const rating = parseFloat(ratingText?.match(/(\d\.\d)/)?.[0]) || 0;
      const deliveryText = $el.find('span[data-cy="delivery-recipe"]').text().toLowerCase();
      const delivery = deliveryText.includes('tomorrow') ? 1 : deliveryText.includes('day') ? parseInt(deliveryText.match(/(\d+)/)?.[0], 10) || 2 : 2;

      if (name && price > 0) {
        products.push({
          id: `amazon_${i}`,
          platform: 'Amazon',
          name,
          price,
          rating,
          delivery,
          image,
          link,
          logo: '🛒',
        });
      }
    });
  } catch (err) {
    console.error('Amazon scrape error:', err.message);
  }
  return products.slice(0, 5); // top 5 results
}

/**
 * Combine and sort products by best deal (lower price, higher rating, faster delivery).
 */
function getBestDeal(products) {
  if (!products.length) return null;
  return products.sort((a, b) => {
    const score = (p) => (100000 - p.price) + (p.rating * 1000) + ((5 - p.delivery) * 500);
    return score(b) - score(a);
  })[0];
}

module.exports = {
  scrapeFlipkart,
  scrapeAmazon,
  getBestDeal,
};