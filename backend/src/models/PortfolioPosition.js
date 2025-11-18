import getDatabase from '../config/database.js';

export class PortfolioPosition {
  static findAll() {
    const db = getDatabase();
    return db.prepare('SELECT * FROM portfolio_positions ORDER BY client_id, asset').all();
  }

  static findById(id) {
    const db = getDatabase();
    return db.prepare('SELECT * FROM portfolio_positions WHERE id = ?').get(id);
  }

  static findByClient(clientId) {
    const db = getDatabase();
    return db.prepare(`
      SELECT * FROM portfolio_positions
      WHERE client_id = ?
      ORDER BY asset
    `).all(clientId);
  }

  static findByClientAndAsset(clientId, asset, protocol = null) {
    const db = getDatabase();

    if (protocol) {
      return db.prepare(`
        SELECT * FROM portfolio_positions
        WHERE client_id = ? AND asset = ? AND protocol = ?
      `).get(clientId, asset, protocol);
    } else {
      return db.prepare(`
        SELECT * FROM portfolio_positions
        WHERE client_id = ? AND asset = ? AND protocol IS NULL
      `).get(clientId, asset);
    }
  }

  static create(data) {
    const db = getDatabase();
    const {
      clientId,
      asset,
      quantity,
      avgBuyPrice,
      currentPrice,
      protocol = null,
      chain = null
    } = data;

    const stmt = db.prepare(`
      INSERT INTO portfolio_positions (
        client_id, asset, quantity, avg_buy_price, current_price, protocol, chain
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(client_id, asset, protocol) DO UPDATE SET
        quantity = excluded.quantity,
        avg_buy_price = excluded.avg_buy_price,
        current_price = excluded.current_price,
        chain = excluded.chain,
        updated_at = CURRENT_TIMESTAMP
    `);

    const result = stmt.run(
      clientId, asset, quantity, avgBuyPrice, currentPrice, protocol, chain
    );

    return this.findByClientAndAsset(clientId, asset, protocol);
  }

  static update(id, data) {
    const db = getDatabase();
    const updates = [];
    const values = [];

    if (data.quantity !== undefined) {
      updates.push('quantity = ?');
      values.push(data.quantity);
    }
    if (data.avgBuyPrice !== undefined) {
      updates.push('avg_buy_price = ?');
      values.push(data.avgBuyPrice);
    }
    if (data.currentPrice !== undefined) {
      updates.push('current_price = ?');
      values.push(data.currentPrice);
    }
    if (data.protocol !== undefined) {
      updates.push('protocol = ?');
      values.push(data.protocol);
    }
    if (data.chain !== undefined) {
      updates.push('chain = ?');
      values.push(data.chain);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = db.prepare(`
      UPDATE portfolio_positions SET ${updates.join(', ')} WHERE id = ?
    `);

    stmt.run(...values);
    return this.findById(id);
  }

  static delete(id) {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM portfolio_positions WHERE id = ?');
    return stmt.run(id);
  }

  static deleteByClient(clientId) {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM portfolio_positions WHERE client_id = ?');
    return stmt.run(clientId);
  }

  static updateCurrentPrices(clientId, prices) {
    const db = getDatabase();
    const positions = this.findByClient(clientId);

    positions.forEach(position => {
      if (prices[position.asset]) {
        this.update(position.id, { currentPrice: prices[position.asset] });
      }
    });
  }
}

export default PortfolioPosition;
