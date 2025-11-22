import express from 'express';
import AuthService from '../services/authService.js';
import Client from '../models/Client.js';
import authenticateToken from '../middleware/auth.js';
import { validateEmail, validatePassword } from '../utils/validators.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'E-mail inválido' });
    }

    const result = await AuthService.login(email, password);

    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// POST /api/auth/logout
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logout realizado com sucesso' });
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const client = await Client.findById(req.user.id);

    if (!client) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({
      id: client.id,
      name: client.name,
      email: client.email,
      role: client.role,
      entryDate: client.entry_date
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/register (apenas para admin criar novos clientes)
router.post('/register', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Apenas administradores podem criar novos usuários' });
    }

    const { name, email, password, role, entryDate } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'E-mail inválido' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
    }

    const result = await AuthService.register({
      name,
      email,
      password,
      role: role || 'client',
      entryDate
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
