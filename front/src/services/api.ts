import axios from 'axios';
import { storage } from '@/utils/storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para adicionar o token JWT em todas as chamadas
api.interceptors.request.use(async (config) => {
  try {
    const token = await storage.getItemAsync('user_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Erro ao obter token para a requisição:", error);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
