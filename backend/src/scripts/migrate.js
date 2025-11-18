import getDatabase from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function runMigrations() {
  const db = getDatabase();

  console.log('Executando migrations...');

  // Criar tabela de clientes
  db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'client' CHECK(role IN ('client', 'admin')),
      entry_date DATE NOT NULL,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✓ Tabela clients criada');

  // Criar tabela de transações
  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL,
      date DATE NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('buy', 'sell', 'yield', 'fee', 'deposit', 'withdrawal')),
      asset TEXT NOT NULL,
      quantity REAL NOT NULL,
      price_usd REAL NOT NULL,
      total_usd REAL NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_transactions_client ON transactions(client_id);
    CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
  `);
  console.log('✓ Tabela transactions criada');

  // Criar tabela de snapshots
  db.exec(`
    CREATE TABLE IF NOT EXISTS snapshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL,
      date DATE NOT NULL,
      total_value_usd REAL NOT NULL,
      hodl_value_usd REAL NOT NULL,
      gain_percent REAL NOT NULL,
      apy REAL NOT NULL,
      btc_price REAL,
      eth_price REAL,
      sol_price REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
      UNIQUE(client_id, date)
    );

    CREATE INDEX IF NOT EXISTS idx_snapshots_client_date ON snapshots(client_id, date DESC);
  `);
  console.log('✓ Tabela snapshots criada');

  // Criar tabela de posições do portfolio
  db.exec(`
    CREATE TABLE IF NOT EXISTS portfolio_positions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL,
      asset TEXT NOT NULL,
      quantity REAL NOT NULL,
      avg_buy_price REAL NOT NULL,
      current_price REAL NOT NULL,
      protocol TEXT,
      chain TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
      UNIQUE(client_id, asset, protocol)
    );

    CREATE INDEX IF NOT EXISTS idx_positions_client ON portfolio_positions(client_id);
  `);
  console.log('✓ Tabela portfolio_positions criada');

  // Criar tabela de cache de preços
  db.exec(`
    CREATE TABLE IF NOT EXISTS price_cache (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      asset TEXT UNIQUE NOT NULL,
      price_usd REAL NOT NULL,
      last_updated DATETIME NOT NULL,
      source TEXT DEFAULT 'coingecko'
    );
  `);
  console.log('✓ Tabela price_cache criada');

  console.log('Migrations concluídas com sucesso!');
}

// Executar se for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations();
  process.exit(0);
}

export default runMigrations;
