import cron from 'node-cron';
import PriceService from '../services/priceService.js';
import SnapshotService from '../services/snapshotService.js';
import { backupDatabase } from '../utils/backup.js';

export function startCronJobs() {
  console.log('Iniciando cron jobs...');

  // Atualizar preços a cada 5 minutos
  cron.schedule('*/5 * * * *', async () => {
    console.log('Executando atualização de preços...');
    try {
      await PriceService.fetchPrices();
      console.log('✓ Preços atualizados');
    } catch (error) {
      console.error('✗ Erro ao atualizar preços:', error.message);
    }
  });

  // Criar snapshots diários às 23:00
  cron.schedule('0 23 * * *', async () => {
    console.log('Executando criação de snapshots diários...');
    try {
      const results = await SnapshotService.createDailySnapshots();
      console.log(`✓ Snapshots criados para ${results.length} clientes`);
    } catch (error) {
      console.error('✗ Erro ao criar snapshots:', error.message);
    }
  });

  // Backup diário às 23:30
  cron.schedule('30 23 * * *', () => {
    console.log('Executando backup do banco de dados...');
    try {
      backupDatabase();
      console.log('✓ Backup criado');
    } catch (error) {
      console.error('✗ Erro ao criar backup:', error.message);
    }
  });

  console.log('✓ Cron jobs configurados:');
  console.log('  - Atualização de preços: a cada 5 minutos');
  console.log('  - Snapshots diários: 23:00');
  console.log('  - Backup: 23:30');
}

export default startCronJobs;
