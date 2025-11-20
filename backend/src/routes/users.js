import express from 'express';
import Client from '../models/Client.js';
import authenticateToken from '../middleware/auth.js';
import { validateEmail, validatePassword } from '../utils/validators.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// Middleware para verificar se é admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
  }
  next();
};

// GET /api/users - Listar todos os usuários
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const getDatabase = (await import('../config/database.js')).default;
    const db = getDatabase();
    const users = db.prepare('SELECT id, name, email, role, entry_date, is_active, created_at FROM clients ORDER BY name').all();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/users - Criar novo usuário
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
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

    // Verificar se o email já existe
    const existingUser = Client.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'E-mail já cadastrado' });
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 10);

    // Criar usuário
    const newUser = Client.create({
      name,
      email,
      passwordHash,
      role: role || 'client',
      entryDate: entryDate || new Date().toISOString().split('T')[0]
    });

    // Retornar sem a senha
    const { password_hash, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/users/:id - Atualizar usuário
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, isActive } = req.body;

    const user = Client.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const updateData = {};

    if (name) updateData.name = name;
    if (email) {
      if (!validateEmail(email)) {
        return res.status(400).json({ error: 'E-mail inválido' });
      }
      // Verificar se o email já está em uso por outro usuário
      const existingUser = Client.findByEmail(email);
      if (existingUser && existingUser.id !== parseInt(id)) {
        return res.status(400).json({ error: 'E-mail já cadastrado' });
      }
      updateData.email = email;
    }
    if (password) {
      if (!validatePassword(password)) {
        return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
      }
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }
    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedUser = Client.update(id, updateData);
    const { password_hash, ...userWithoutPassword } = updatedUser;

    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/users/:id - Desativar usuário
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;

    // Não permitir desativar a si mesmo
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'Você não pode desativar sua própria conta' });
    }

    const user = Client.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    Client.delete(id);
    res.json({ message: 'Usuário desativado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/users/:id/activate - Reativar usuário
router.patch('/:id/activate', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;

    const user = Client.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const updatedUser = Client.update(id, { isActive: true });
    const { password_hash, ...userWithoutPassword } = updatedUser;

    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
