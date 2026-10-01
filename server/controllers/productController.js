const {
  searchRetailers,
  isElectronicsQuery,
} = require('../utils/scrapeHelpers');

const scrapeProducts = async (req, res) => {
  const query = typeof req.query.query === 'string' ? req.query.query.trim() : '';
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  if (!isElectronicsQuery(query)) {
    return res.status(400).json({
      error: 'Search for an electronic product, such as a phone, laptop, TV, camera, or gaming console.',
    });
  }

  try {
    const { results, retailers } = await searchRetailers(query);
    const bestDeal = results.length
      ? results.reduce((best, product) => product.price < best.price ? product : best)
      : null;

    return res.json({
      query,
      results,
      bestDeal,
      source: 'live',
      retailers,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Product search failed:', error);
    return res.status(502).json({ error: 'Live product search failed. Please try again shortly.' });
  }
};

module.exports = { scrapeProducts };
