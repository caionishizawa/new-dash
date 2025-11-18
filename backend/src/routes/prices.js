import express from 'express';
import authenticateToken from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roleCheck.js';
import PriceService from '../services/priceService.js';

const router = express.Router();

// GET /api/prices/current
router.get('/current', authenticateToken, async (req, res) => {
  try {
    const prices = await PriceService.getCurrentPrices();
    res.json(prices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/prices/update
router.post('/update', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const prices = await PriceService.fetchPrices();
    res.json({
      message: 'Preços atualizados com sucesso',
      prices
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
