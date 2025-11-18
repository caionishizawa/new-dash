import express from 'express';
import authenticateToken from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roleCheck.js';
import Client from '../models/Client.js';
import Transaction from '../models/Transaction.js';
import PortfolioPosition from '../models/PortfolioPosition.js';
import CalculationService from '../services/calculationService.js';
import PriceService from '../services/priceService.js';
import SnapshotService from '../services/snapshotService.js';
import {
  validateDate,
  validateTransactionType,
  validateAsset,
  validateNumber
} from '../utils/validators.js';

const router = express.Router();

// Middleware para todas as rotas admin
router.use(authenticateToken);
router.use(requireAdmin);

// GET /api/admin/clients
router.get('/clients', (req, res) => {
  try {
    const clients = Client.findAll();

    const clientsData = clients.map(c => ({
      id: c.id,
      name: c.name,
      email: c.email,
      role: c.role,
      entryDate: c.entry_date,
      isActive: c.is_active
    }));

    res.json(clientsData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/admin/transaction
router.post('/transaction', async (req, res) => {
  try {
    const { clientId, date, type, asset, quantity, priceUsd, notes } = req.body;

    // Validações
    if (!clientId || !date || !type || !asset || !quantity || !priceUsd) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    if (!validateDate(date)) {
      return res.status(400).json({ error: 'Data inválida' });
    }

    if (!validateTransactionType(type)) {
      return res.status(400).json({ error: 'Tipo de transação inválido' });
    }

    if (!validateAsset(asset)) {
      return res.status(400).json({ error: 'Ativo inválido' });
    }

    if (!validateNumber(quantity) || quantity <= 0) {
      return res.status(400).json({ error: 'Quantidade inválida' });
    }

    if (!validateNumber(priceUsd) || priceUsd < 0) {
      return res.status(400).json({ error: 'Preço inválido' });
    }

    const totalUsd = quantity * priceUsd;

    const transaction = Transaction.create({
      clientId: parseInt(clientId),
      date,
      type,
      asset,
      quantity: parseFloat(quantity),
      priceUsd: parseFloat(priceUsd),
      totalUsd,
      notes
    });

    // Recalcular portfolio
    await CalculationService.recalculatePortfolio(parseInt(clientId));

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/admin/transaction/:id
router.put('/transaction/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { date, type, asset, quantity, priceUsd, notes } = req.body;

    const transaction = Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    const updates = {};

    if (date !== undefined) {
      if (!validateDate(date)) {
        return res.status(400).json({ error: 'Data inválida' });
      }
      updates.date = date;
    }

    if (type !== undefined) {
      if (!validateTransactionType(type)) {
        return res.status(400).json({ error: 'Tipo de transação inválido' });
      }
      updates.type = type;
    }

    if (asset !== undefined) {
      if (!validateAsset(asset)) {
        return res.status(400).json({ error: 'Ativo inválido' });
      }
      updates.asset = asset;
    }

    if (quantity !== undefined) {
      if (!validateNumber(quantity) || quantity <= 0) {
        return res.status(400).json({ error: 'Quantidade inválida' });
      }
      updates.quantity = parseFloat(quantity);
    }

    if (priceUsd !== undefined) {
      if (!validateNumber(priceUsd) || priceUsd < 0) {
        return res.status(400).json({ error: 'Preço inválido' });
      }
      updates.priceUsd = parseFloat(priceUsd);
    }

    if (notes !== undefined) {
      updates.notes = notes;
    }

    // Recalcular total se quantidade ou preço mudou
    if (updates.quantity || updates.priceUsd) {
      const finalQuantity = updates.quantity || transaction.quantity;
      const finalPrice = updates.priceUsd || transaction.price_usd;
      updates.totalUsd = finalQuantity * finalPrice;
    }

    const updated = Transaction.update(id, updates);

    // Recalcular portfolio
    await CalculationService.recalculatePortfolio(transaction.client_id);

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/admin/transaction/:id
router.delete('/transaction/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const transaction = Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    const clientId = transaction.client_id;

    Transaction.delete(id);

    // Recalcular portfolio
    await CalculationService.recalculatePortfolio(clientId);

    res.json({ message: 'Transação removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/admin/portfolio/:clientId/:asset
router.put('/portfolio/:clientId/:asset', async (req, res) => {
  try {
    const clientId = parseInt(req.params.clientId);
    const asset = req.params.asset;
    const { quantity, avgBuyPrice, protocol } = req.body;

    const position = PortfolioPosition.findByClientAndAsset(clientId, asset, protocol || null);

    if (!position) {
      return res.status(404).json({ error: 'Posição não encontrada' });
    }

    const updates = {};

    if (quantity !== undefined) {
      if (!validateNumber(quantity) || quantity < 0) {
        return res.status(400).json({ error: 'Quantidade inválida' });
      }
      updates.quantity = parseFloat(quantity);
    }

    if (avgBuyPrice !== undefined) {
      if (!validateNumber(avgBuyPrice) || avgBuyPrice < 0) {
        return res.status(400).json({ error: 'Preço médio inválido' });
      }
      updates.avgBuyPrice = parseFloat(avgBuyPrice);
    }

    const updated = PortfolioPosition.update(position.id, updates);

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/admin/snapshot
router.post('/snapshot', async (req, res) => {
  try {
    const { clientId, date } = req.body;

    if (clientId) {
      const snapshot = await SnapshotService.createSnapshot(parseInt(clientId), date);
      res.status(201).json(snapshot);
    } else {
      const results = await SnapshotService.createDailySnapshots();
      res.status(201).json(results);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/admin/recalculate/:clientId
router.post('/recalculate/:clientId', async (req, res) => {
  try {
    const clientId = parseInt(req.params.clientId);

    const portfolio = await CalculationService.recalculatePortfolio(clientId);

    res.json({
      message: 'Portfólio recalculado com sucesso',
      portfolio
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
