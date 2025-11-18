import getDatabase from '../config/database.js';

export class Client {
  static findAll() {
    const db = getDatabase();
    return db.prepare('SELECT * FROM clients WHERE is_active = 1 ORDER BY name').all();
  }

  static findById(id) {
    const db = getDatabase();
    return db.prepare('SELECT * FROM clients WHERE id = ?').get(id);
  }

  static findByEmail(email) {
    const db = getDatabase();
    return db.prepare('SELECT * FROM clients WHERE email = ?').get(email);
  }

  static create(data) {
    const db = getDatabase();
    const { name, email, passwordHash, role = 'client', entryDate } = data;

    const stmt = db.prepare(`
      INSERT INTO clients (name, email, password_hash, role, entry_date)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(name, email, passwordHash, role, entryDate);
    return this.findById(result.lastInsertRowid);
  }

  static update(id, data) {
    const db = getDatabase();
    const updates = [];
    const values = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.email !== undefined) {
      updates.push('email = ?');
      values.push(data.email);
    }
    if (data.passwordHash !== undefined) {
      updates.push('password_hash = ?');
      values.push(data.passwordHash);
    }
    if (data.isActive !== undefined) {
      updates.push('is_active = ?');
      values.push(data.isActive ? 1 : 0);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = db.prepare(`
      UPDATE clients SET ${updates.join(', ')} WHERE id = ?
    `);

    stmt.run(...values);
    return this.findById(id);
  }

  static delete(id) {
    const db = getDatabase();
    const stmt = db.prepare('UPDATE clients SET is_active = 0 WHERE id = ?');
    return stmt.run(id);
  }

  static getDaysSinceEntry(entryDate) {
    const entry = new Date(entryDate);
    const now = new Date();
    const diffTime = Math.abs(now - entry);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
}

export default Client;
