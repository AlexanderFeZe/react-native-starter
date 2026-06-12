import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import { API_URL } from '@env';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inyectar el token en las cabeceras
api.interceptors.request.use(async (config) => {
  const credentials = await Keychain.getGenericPassword();
  if (credentials) {
    config.headers.Authorization = `Bearer ${credentials.password}`;
  }
  return config;
});

// Manejo global del error 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Limpiar credenciales corruptas o expiradas
      await Keychain.resetGenericPassword();
      // TODO: Disparar la acción de logout de Zustand o emitir un evento global para redirigir al Login
    }
    return Promise.reject(error);
  }
);
