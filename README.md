# 🚀 Nishizawa Capital - Sistema de Gerenciamento de Carteiras Cripto

Sistema completo de gerenciamento de investimentos em criptomoedas desenvolvido para a Nishizawa Capital. Inclui dashboard interativo, cálculos de performance, comparação HODL, e painel administrativo.

## 📋 Características

### 🎯 Para Clientes
- **Dashboard Interativo**: Visualização completa do portfólio com gráficos e estatísticas
- **Análise HODL**: Comparação entre estratégia ativa vs HODL
- **Performance**: Gráficos de histórico, alocação de ativos e APY
- **Transparência**: Histórico completo de transações e rendimentos

### 👨‍💼 Para Administradores
- **Gestão de Clientes**: Visualizar e gerenciar múltiplos clientes
- **Transações**: Adicionar compras, vendas, rendimentos e taxas
- **Preços**: Atualização automática via CoinGecko API
- **Snapshots**: Registro diário automático de performance

### 💎 Recursos Técnicos
- **Multi-chain**: Suporte para Ethereum, Solana, Arbitrum, Base
- **DeFi**: Integração com Aave, Pendle, Ethena e outros protocolos
- **Segurança**: JWT authentication, bcrypt, validações
- **Performance**: Cache de preços, queries otimizadas
- **Backup**: Backup automático diário do banco de dados

## 🛠️ Tecnologias

### Backend
- **Node.js** + **Express** - API REST
- **SQLite** (better-sqlite3) - Banco de dados
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **axios** - Integração CoinGecko
- **node-cron** - Tarefas agendadas
- **winston** - Logging

### Frontend
- **React 18** - Interface do usuário
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **Recharts** - Gráficos
- **React Router** - Navegação
- **Lucide React** - Ícones
- **Axios** - Requisições HTTP

## 📁 Estrutura do Projeto

```
new-dash/
├── backend/
│   ├── src/
│   │   ├── config/          # Configurações
│   │   ├── models/          # Models (Client, Transaction, etc)
│   │   ├── services/        # Lógica de negócio
│   │   ├── routes/          # Rotas da API
│   │   ├── middleware/      # Autenticação, validação
│   │   ├── utils/           # Utilitários
│   │   ├── scripts/         # Seeds, migrations, cron
│   │   └── server.js        # Entry point
│   ├── database/
│   │   ├── nishizawa.db    # Banco SQLite
│   │   └── backups/        # Backups automáticos
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # Componentes React
    │   ├── pages/          # Páginas
    │   ├── contexts/       # Context API (Auth)
    │   ├── services/       # API client
    │   ├── utils/          # Formatters, constants
    │   └── styles/         # CSS global
    └── package.json
```

## 🚀 Instalação e Uso

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### 1. Backend

```bash
cd backend

# Instalar dependências
npm install

# Popular banco de dados
npm run seed

# Iniciar servidor (porta 3000)
npm start

# Ou modo desenvolvimento com nodemon
npm run dev
```

### 2. Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar em modo desenvolvimento (porta 5173)
npm run dev

# Build para produção
npm run build
```

### 3. Acessar o Sistema

Abra o navegador em: `http://localhost:5173`

## 🔑 Credenciais de Acesso

### Administrador
- **Email**: caiojundi@gmail.com
- **Senha**: admin123

### Cliente Teste
- **Email**: cliente@teste.com
- **Senha**: cliente123

## 📊 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Dados do usuário

### Dashboard
- `GET /api/dashboard/:clientId` - Dashboard completo

### Cliente
- `GET /api/client/profile` - Perfil
- `GET /api/client/transactions` - Transações

### Admin
- `GET /api/admin/clients` - Lista clientes
- `POST /api/admin/transaction` - Adicionar transação
- `PUT /api/admin/transaction/:id` - Editar transação
- `DELETE /api/admin/transaction/:id` - Remover transação
- `PUT /api/admin/portfolio/:clientId/:asset` - Editar posição
- `POST /api/admin/snapshot` - Criar snapshot

### Preços
- `GET /api/prices/current` - Preços atuais
- `POST /api/prices/update` - Atualizar preços (admin)

## 🎨 Design System

### Cores (Dark Theme)
- **Background**: `#0F1419`, `#1A1F26`, `#252B34`
- **Text**: `#FFFFFF`, `#8B949E`, `#6B7280`
- **Accent**: `#3B82F6`
- **Success**: `#10B981`
- **Danger**: `#EF4444`
- **Crypto**: BTC `#F7931A`, ETH `#627EEA`, SOL `#14F195`

### Fontes
- **Sans-serif**: Inter
- **Monospace**: JetBrains Mono

## 🔄 Cron Jobs

O sistema executa automaticamente:
- **A cada 5 minutos**: Atualização de preços do CoinGecko
- **Diariamente às 23:00**: Criação de snapshots
- **Diariamente às 23:30**: Backup do banco de dados

## 🧮 Cálculos

### HODL Value
Valor que a carteira teria se nenhuma ação fosse tomada após as compras iniciais.

### Actual Value
Valor real considerando todas as transações (compras, vendas, rendimentos).

### Vantagem vs HODL
```
Vantagem = (Valor Atual - Valor HODL) / Valor HODL * 100
```

### APY
```
APY = (Lucro / Investido) * (365 / Dias desde entrada) * 100
```

## 📝 Variáveis de Ambiente

### Backend (.env)
```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
DATABASE_PATH=./database/nishizawa.db
COINGECKO_API_URL=https://api.coingecko.com/api/v3
ADMIN_EMAIL=caiojundi@gmail.com
ADMIN_PASSWORD=admin123
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

## 🔒 Segurança

- ✅ Autenticação JWT com tokens de 7 dias
- ✅ Senhas hasheadas com bcrypt (10 rounds)
- ✅ Validação de inputs em todas as rotas
- ✅ Proteção contra SQL injection (prepared statements)
- ✅ CORS configurado
- ✅ Role-based access control (Admin/Client)

## 📦 Scripts NPM

### Backend
```bash
npm start          # Iniciar servidor
npm run dev        # Modo desenvolvimento
npm run seed       # Popular banco
npm run migrate    # Executar migrations
npm run backup     # Backup manual
```

### Frontend
```bash
npm run dev        # Servidor desenvolvimento
npm run build      # Build produção
npm run preview    # Preview build
```

## 🐛 Troubleshooting

### Backend não inicia
1. Verifique se a porta 3000 está livre
2. Rode `npm run seed` novamente
3. Verifique as permissões da pasta `database/`

### Frontend não conecta
1. Verifique se o backend está rodando
2. Confirme a variável `VITE_API_URL` no `.env`
3. Verifique CORS no backend

### Preços não atualizam
1. CoinGecko tem rate limit - aguarde alguns minutos
2. Preços são cacheados por 5 minutos
3. Admin pode forçar atualização via botão

## 📈 Próximas Funcionalidades

- [ ] Multi-idioma (EN/PT)
- [ ] Notificações push
- [ ] Exportar relatórios PDF
- [ ] Integração com mais exchanges
- [ ] Modo light theme
- [ ] Mobile app (React Native)

## 👨‍💻 Desenvolvido para

**Nishizawa Capital**
Sistema de gerenciamento de portfólio cripto

---

**Versão**: 1.0.0
**Data**: Novembro 2024
**Status**: ✅ Produção
