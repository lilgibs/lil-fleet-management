// src/shared/api/index.ts
import axios from 'axios';
import { config } from '../config';
import { getErrorMessage } from './error';

export const api = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 15_000,
});

// Ganti error.message jadi pesan yang mudah dipahami user (lihat error.ts)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    error.message = getErrorMessage(error);
    return Promise.reject(error);
  }
);
