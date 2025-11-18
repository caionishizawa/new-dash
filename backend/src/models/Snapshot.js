import getDatabase from '../config/database.js';

export class Snapshot {
  static findAll() {
    const db = getDatabase();
    return db.prepare('SELECT * FROM snapshots ORDER BY date DESC').all();
  }

  static findById(id) {
    const db = getDatabase();
    return db.prepare('SELECT * FROM snapshots WHERE id = ?').get(id);
  }

  static findByClient(clientId, limit = null) {
    const db = getDatabase();
    let query = 'SELECT * FROM snapshots WHERE client_id = ? ORDER BY date DESC';

    if (limit) {
      query += ` LIMIT ${limit}`;
    }

    return db.prepare(query).all(clientId);
  }

  static findByClientAndDateRange(clientId, startDate, endDate) {
    const db = getDatabase();
    return db.prepare(`
      SELECT * FROM snapshots
      WHERE client_id = ? AND date BETWEEN ? AND ?
      ORDER BY date ASC
    `).all(clientId, startDate, endDate);
  }

  static findLatestByClient(clientId) {
    const db = getDatabase();
    return db.prepare(`
      SELECT * FROM snapshots WHERE client_id = ? ORDER BY date DESC LIMIT 1
    `).get(clientId);
  }

  static create(data) {
    const db = getDatabase();
    const {
      clientId,
      date,
      totalValueUsd,
      hodlValueUsd,
      gainPercent,
      apy,
      btcPrice,
      ethPrice,
      solPrice
    } = data;

    const stmt = db.prepare(`
      INSERT INTO snapshots (
        client_id, date, total_value_usd, hodl_value_usd, gain_percent, apy,
        btc_price, eth_price, sol_price
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(client_id, date) DO UPDATE SET
        total_value_usd = excluded.total_value_usd,
        hodl_value_usd = excluded.hodl_value_usd,
        gain_percent = excluded.gain_percent,
        apy = excluded.apy,
        btc_price = excluded.btc_price,
        eth_price = excluded.eth_price,
        sol_price = excluded.sol_price
    `);

    const result = stmt.run(
      clientId, date, totalValueUsd, hodlValueUsd, gainPercent, apy,
      btcPrice || null, ethPrice || null, solPrice || null
    );

    return this.findByClient(clientId, 1)[0];
  }

  static delete(id) {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM snapshots WHERE id = ?');
    return stmt.run(id);
  }

  static deleteByClient(clientId) {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM snapshots WHERE client_id = ?');
    return stmt.run(clientId);
  }
}

export default Snapshot;
