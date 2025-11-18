import express from 'express';
import authenticateToken from '../middleware/auth.js';
import Client from '../models/Client.js';
import Transaction from '../models/Transaction.js';

const router = express.Router();

// GET /api/client/profile
router.get('/profile', authenticateToken, (req, res) => {
  try {
    const client = Client.findById(req.user.id);

    if (!client) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    res.json({
      id: client.id,
      name: client.name,
      email: client.email,
      role: client.role,
      entryDate: client.entry_date,
      isActive: client.is_active
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/client/transactions
router.get('/transactions', authenticateToken, (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const transactions = Transaction.findByClient(req.user.id, limit);

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
