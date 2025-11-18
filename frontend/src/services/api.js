import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

// Dashboard
export const dashboardAPI = {
  getDashboard: (clientId, period = 90) =>
    api.get(`/dashboard/${clientId}?period=${period}`),
};

// Client
export const clientAPI = {
  getProfile: () => api.get('/client/profile'),
  getTransactions: (limit = null) => {
    const url = limit ? `/client/transactions?limit=${limit}` : '/client/transactions';
    return api.get(url);
  },
};

// Admin
export const adminAPI = {
  getClients: () => api.get('/admin/clients'),
  addTransaction: (data) => api.post('/admin/transaction', data),
  addBulkTransactions: (transactions) => api.post('/admin/transactions/bulk', transactions),
  updateTransaction: (id, data) => api.put(`/admin/transaction/${id}`, data),
  deleteTransaction: (id) => api.delete(`/admin/transaction/${id}`),
  updatePortfolio: (clientId, asset, data) =>
    api.put(`/admin/portfolio/${clientId}/${asset}`, data),
  createSnapshot: (clientId = null, date = null) =>
    api.post('/admin/snapshot', { clientId, date }),
  recalculatePortfolio: (clientId) =>
    api.post(`/admin/recalculate/${clientId}`),
};

// Prices
export const pricesAPI = {
  getCurrentPrices: () => api.get('/prices/current'),
  updatePrices: () => api.post('/prices/update'),
};

export default api;
