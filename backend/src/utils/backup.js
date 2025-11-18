import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function backupDatabase() {
  try {
    const dbPath = path.join(__dirname, '../../database/nishizawa.db');
    const backupDir = path.join(__dirname, '../../database/backups');

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `nishizawa_${timestamp}.db`);

    if (fs.existsSync(dbPath)) {
      fs.copyFileSync(dbPath, backupPath);
      console.log(`Backup criado: ${backupPath}`);

      cleanOldBackups(backupDir);
      return backupPath;
    } else {
      console.error('Arquivo de banco de dados não encontrado');
      return null;
    }
  } catch (error) {
    console.error('Erro ao criar backup:', error);
    return null;
  }
}

function cleanOldBackups(backupDir, keepCount = 7) {
  try {
    const files = fs.readdirSync(backupDir)
      .filter(file => file.endsWith('.db'))
      .map(file => ({
        name: file,
        path: path.join(backupDir, file),
        mtime: fs.statSync(path.join(backupDir, file)).mtime
      }))
      .sort((a, b) => b.mtime - a.mtime);

    if (files.length > keepCount) {
      const filesToDelete = files.slice(keepCount);
      filesToDelete.forEach(file => {
        fs.unlinkSync(file.path);
        console.log(`Backup antigo removido: ${file.name}`);
      });
    }
  } catch (error) {
    console.error('Erro ao limpar backups antigos:', error);
  }
}

export default { backupDatabase, cleanOldBackups };
