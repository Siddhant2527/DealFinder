import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { scrapeProducts } = require('../../server/controllers/productController.js');

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    return scrapeProducts(req, res);
}
