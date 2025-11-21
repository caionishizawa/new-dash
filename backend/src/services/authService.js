import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Client from '../models/Client.js';
import { config } from '../config/environment.js';

export class AuthService {
  static async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  static generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    });
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, config.jwtSecret);
    } catch (error) {
      return null;
    }
  }

  static async login(email, password) {
    const client = Client.findByEmail(email);

    if (!client) {
      throw new Error('E-mail ou senha inválidos');
    }

    if (!client.is_active) {
      throw new Error('Conta desativada');
    }

    const isPasswordValid = await this.comparePassword(password, client.password_hash);

    if (!isPasswordValid) {
      throw new Error('E-mail ou senha inválidos');
    }

    const token = this.generateToken(client);

    return {
      token,
      user: {
        id: client.id,
        name: client.name,
        email: client.email,
        role: client.role
      }
    };
  }

  static async register(data) {
    const { name, email, password, role = 'client', entryDate } = data;

    const existingClient = Client.findByEmail(email);
    if (existingClient) {
      throw new Error('E-mail já cadastrado');
    }

    const passwordHash = await this.hashPassword(password);

    const client = Client.create({
      name,
      email,
      passwordHash,
      role,
      entryDate: entryDate || new Date().toISOString().split('T')[0]
    });

    const token = this.generateToken(client);

    return {
      token,
      user: {
        id: client.id,
        name: client.name,
        email: client.email,
        role: client.role
      }
    };
  }

  static async changePassword(userId, oldPassword, newPassword) {
    const client = Client.findById(userId);

    if (!client) {
      throw new Error('Usuário não encontrado');
    }

    const isPasswordValid = await this.comparePassword(oldPassword, client.password_hash);

    if (!isPasswordValid) {
      throw new Error('Senha atual inválida');
    }

    const newPasswordHash = await this.hashPassword(newPassword);

    Client.update(userId, { passwordHash: newPasswordHash });

    return true;
  }
}

export default AuthService;
