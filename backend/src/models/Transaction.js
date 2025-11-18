import getDatabase from '../config/database.js';

export class Transaction {
  static findAll() {
    const db = getDatabase();
    return db.prepare('SELECT * FROM transactions ORDER BY date DESC, id DESC').all();
  }

  static findById(id) {
    const db = getDatabase();
    return db.prepare('SELECT * FROM transactions WHERE id = ?').get(id);
  }

  static findByClient(clientId, limit = null) {
    const db = getDatabase();
    let query = 'SELECT * FROM transactions WHERE client_id = ? ORDER BY date DESC, id DESC';

    if (limit) {
      query += ` LIMIT ${limit}`;
    }

    return db.prepare(query).all(clientId);
  }

  static findByClientAndDateRange(clientId, startDate, endDate) {
    const db = getDatabase();
    return db.prepare(`
      SELECT * FROM transactions
      WHERE client_id = ? AND date BETWEEN ? AND ?
      ORDER BY date DESC
    `).all(clientId, startDate, endDate);
  }

  static getInitialTransactions(clientId) {
    const db = getDatabase();
    // Retorna as primeiras transações de compra (buy) para cálculo HODL
    return db.prepare(`
      SELECT * FROM transactions
      WHERE client_id = ? AND type = 'buy'
      ORDER BY date ASC
    `).all(clientId);
  }

  static getTotalInvested(clientId) {
    const db = getDatabase();
    const result = db.prepare(`
      SELECT
        COALESCE(SUM(CASE WHEN type IN ('deposit', 'buy') THEN total_usd ELSE 0 END), 0) -
        COALESCE(SUM(CASE WHEN type IN ('withdrawal', 'sell', 'fee') THEN total_usd ELSE 0 END), 0) as total
      FROM transactions
      WHERE client_id = ?
    `).get(clientId);

    return result.total || 0;
  }

  static create(data) {
    const db = getDatabase();
    const { clientId, date, type, asset, quantity, priceUsd, totalUsd, notes } = data;

    const stmt = db.prepare(`
      INSERT INTO transactions (client_id, date, type, asset, quantity, price_usd, total_usd, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(clientId, date, type, asset, quantity, priceUsd, totalUsd, notes || null);
    return this.findById(result.lastInsertRowid);
  }

  static update(id, data) {
    const db = getDatabase();
    const updates = [];
    const values = [];

    if (data.date !== undefined) {
      updates.push('date = ?');
      values.push(data.date);
    }
    if (data.type !== undefined) {
      updates.push('type = ?');
      values.push(data.type);
    }
    if (data.asset !== undefined) {
      updates.push('asset = ?');
      values.push(data.asset);
    }
    if (data.quantity !== undefined) {
      updates.push('quantity = ?');
      values.push(data.quantity);
    }
    if (data.priceUsd !== undefined) {
      updates.push('price_usd = ?');
      values.push(data.priceUsd);
    }
    if (data.totalUsd !== undefined) {
      updates.push('total_usd = ?');
      values.push(data.totalUsd);
    }
    if (data.notes !== undefined) {
      updates.push('notes = ?');
      values.push(data.notes);
    }

    values.push(id);

    const stmt = db.prepare(`
      UPDATE transactions SET ${updates.join(', ')} WHERE id = ?
    `);

    stmt.run(...values);
    return this.findById(id);
  }

  static delete(id) {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM transactions WHERE id = ?');
    return stmt.run(id);
  }
}

export default Transaction;
