import AuthService from '../services/authService.js';
import Client from '../models/Client.js';
import Transaction from '../models/Transaction.js';
import PriceService from '../services/priceService.js';
import CalculationService from '../services/calculationService.js';
import { config } from '../config/environment.js';

async function seed() {
  console.log('Iniciando seed do banco de dados Supabase...');

  // Verificar se já existe admin
  const existingAdmin = await Client.findByEmail(config.adminEmail);
  if (existingAdmin) {
    console.log('Admin já existe. Pulando criação do admin.');
  } else {
    // Criar admin
    const adminPasswordHash = await AuthService.hashPassword(config.adminPassword);
    const admin = await Client.create({
      name: config.adminName,
      email: config.adminEmail,
      passwordHash: adminPasswordHash,
      role: 'admin',
      entryDate: '2024-01-01'
    });
    console.log(`✓ Admin criado: ${admin.email}`);
  }

  // Verificar se já existe cliente teste
  const existingClient = await Client.findByEmail('cliente@teste.com');
  if (existingClient) {
    console.log('Cliente teste já existe. Pulando criação do cliente teste.');
  } else {
    // Criar cliente teste
    const clientPasswordHash = await AuthService.hashPassword('cliente123');
    const client = await Client.create({
      name: 'Cliente Teste',
      email: 'cliente@teste.com',
      passwordHash: clientPasswordHash,
      role: 'client',
      entryDate: '2024-06-01'
    });
    console.log(`✓ Cliente teste criado: ${client.email}`);

    // Criar transações do cliente teste
    const transactions = [
      { date: '2024-06-01', type: 'deposit', asset: 'USDT', quantity: 50000, priceUsd: 1.0, notes: 'Investimento inicial' },
      { date: '2024-06-01', type: 'buy', asset: 'BTC', quantity: 0.25, priceUsd: 100000, notes: null },
      { date: '2024-06-01', type: 'buy', asset: 'ETH', quantity: 7, priceUsd: 3500, notes: null },
      { date: '2024-07-15', type: 'yield', asset: 'BTC', quantity: 0.005, priceUsd: 103000, notes: 'Yield Aave' },
      { date: '2024-08-10', type: 'yield', asset: 'ETH', quantity: 0.2, priceUsd: 3600, notes: 'Yield Pendle' },
      { date: '2024-09-01', type: 'buy', asset: 'SOL', quantity: 30, priceUsd: 150, notes: null },
      { date: '2024-10-15', type: 'yield', asset: 'SOL', quantity: 1.5, priceUsd: 160, notes: 'Yield Marinade' }
    ];

    for (const tx of transactions) {
      const totalUsd = tx.quantity * tx.priceUsd;
      await Transaction.create({
        clientId: client.id,
        date: tx.date,
        type: tx.type,
        asset: tx.asset,
        quantity: tx.quantity,
        priceUsd: tx.priceUsd,
        totalUsd: totalUsd,
        notes: tx.notes
      });
    }
    console.log(`✓ ${transactions.length} transações criadas para o cliente teste`);

    // Recalcular portfolio do cliente teste
    await CalculationService.recalculatePortfolio(client.id);
    console.log('✓ Portfolio do cliente teste recalculado');
  }

  // Buscar e cachear preços iniciais
  try {
    console.log('Buscando preços atuais do CoinGecko...');
    const prices = await PriceService.fetchPrices();
    console.log('✓ Preços atualizados:', prices);
  } catch (error) {
    console.error('⚠ Erro ao buscar preços:', error.message);
    console.log('Usando preços padrão...');

    // Inserir preços padrão
    const defaultPrices = {
      BTC: 100000,
      ETH: 3500,
      SOL: 150,
      ENA: 1.2,
      PENDLE: 5.5,
      USDT: 1.0,
      USDC: 1.0,
      DAI: 1.0,
      USD: 1.0
    };

    await PriceService.updatePriceCache(defaultPrices);
    console.log('✓ Preços padrão configurados');
  }

  console.log('\n✅ Seed concluído com sucesso!');
  console.log('\nCredenciais de acesso:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('ADMIN:');
  console.log(`  Email: ${config.adminEmail}`);
  console.log(`  Senha: ${config.adminPassword}`);
  console.log('\nCLIENTE TESTE:');
  console.log('  Email: cliente@teste.com');
  console.log('  Senha: cliente123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// Executar sempre quando chamado via npm run seed
seed()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Erro no seed:', error);
    process.exit(1);
  });

export default seed;
