export const LABELS = {
  // Login
  login: 'Entrar',
  email: 'E-mail',
  password: 'Senha',
  logout: 'Sair',

  // Dashboard
  totalValue: 'Valor Total',
  invested: 'Valor Inicial Investido',
  gain: 'Ganho/Perda',
  hodlAdvantage: 'Vantagem vs HODL',
  apy: 'APY Anual',
  performance: 'Performance',
  allocation: 'Alocação',
  portfolio: 'Portfólio',
  history: 'Histórico',
  recentTransactions: 'Transações Recentes',

  // Admin
  clients: 'Clientes',
  addTransaction: 'Adicionar Transação',
  updatePrices: 'Atualizar Preços',
  viewDashboard: 'Ver Dashboard',
  overview: 'Visão Geral',

  // Portfolio
  asset: 'Ativo',
  quantity: 'Quantidade',
  price: 'Preço',
  avgPrice: 'Preço Médio',
  currentPrice: 'Preço Atual',
  value: 'Valor',
  gainPercent: 'Ganho %',
  protocol: 'Protocolo',
  chain: 'Chain',

  // Transações
  date: 'Data',
  type: 'Tipo',
  amount: 'Quantidade',
  total: 'Total',
  notes: 'Observações',

  // Tipos de transação
  buy: 'Compra',
  sell: 'Venda',
  yield: 'Rendimento',
  fee: 'Taxa',
  deposit: 'Depósito',
  withdrawal: 'Saque',

  // Status
  loading: 'Carregando...',
  error: 'Erro',
  success: 'Sucesso',
  noData: 'Sem dados disponíveis',

  // Actions
  save: 'Salvar',
  cancel: 'Cancelar',
  edit: 'Editar',
  delete: 'Excluir',
  add: 'Adicionar',
  update: 'Atualizar',
  refresh: 'Atualizar',
};

export const TRANSACTION_TYPES = [
  { value: 'buy', label: 'Compra', color: 'text-accent' },
  { value: 'sell', label: 'Venda', color: 'text-warning' },
  { value: 'yield', label: 'Rendimento', color: 'text-success' },
  { value: 'fee', label: 'Taxa', color: 'text-danger' },
  { value: 'deposit', label: 'Depósito', color: 'text-success' },
  { value: 'withdrawal', label: 'Saque', color: 'text-warning' },
];

export const CRYPTO_COLORS = {
  BTC: '#F7931A',
  ETH: '#627EEA',
  SOL: '#14F195',
  USDT: '#26A17B',
  USDC: '#2775CA',
  DAI: '#F4B731',
  USD: '#26A17B',
  ENA: '#8B5CF6',
  PENDLE: '#EC4899',
};

export const CRYPTO_INFO = {
  BTC: { name: 'Bitcoin', symbol: '₿', color: '#F7931A' },
  ETH: { name: 'Ethereum', symbol: 'Ξ', color: '#627EEA' },
  SOL: { name: 'Solana', symbol: '◎', color: '#14F195' },
  USDT: { name: 'Tether', symbol: '₮', color: '#26A17B' },
  USDC: { name: 'USD Coin', symbol: '$', color: '#2775CA' },
  DAI: { name: 'DAI', symbol: '◈', color: '#F4B731' },
  USD: { name: 'US Dollar', symbol: '$', color: '#26A17B' },
  ENA: { name: 'Ethena', symbol: 'E', color: '#8B5CF6' },
  PENDLE: { name: 'Pendle', symbol: 'P', color: '#EC4899' },
};

export const CHART_COLORS = {
  portfolio: '#3B82F6',
  hodl: '#6B7280',
  gain: '#10B981',
  loss: '#EF4444',
};

export default {
  LABELS,
  TRANSACTION_TYPES,
  CRYPTO_COLORS,
  CRYPTO_INFO,
  CHART_COLORS,
};
