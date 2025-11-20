import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { config } from './config/environment.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import clientRoutes from './routes/client.js';
import adminRoutes from './routes/admin.js';
import pricesRoutes from './routes/prices.js';
import usersRoutes from './routes/users.js';
import startCronJobs from './scripts/cron.js';
import logger from './utils/logger.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/prices', pricesRoutes);
app.use('/api/users', usersRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = config.port;

app.listen(PORT, () => {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🚀 Nishizawa Capital Backend`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📡 Servidor rodando na porta ${PORT}`);
  console.log(`🌍 Ambiente: ${config.nodeEnv}`);
  console.log(`🔗 API: http://localhost:${PORT}`);
  console.log(`💚 Health: http://localhost:${PORT}/health`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  // Iniciar cron jobs
  startCronJobs();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM recebido, encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT recebido, encerrando servidor...');
  process.exit(0);
});

export default app;
