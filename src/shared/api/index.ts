// src/shared/api/index.ts
import axios from 'axios';
import { config } from '../config';
import { getErrorMessage } from './error';

export const api = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 15_000,
});

// Ambil page[offset] dari URL di `links`
export const getOffset = (link?: string) => {
  const offset = link ? new URL(link).searchParams.get('page[offset]') : null;
  return offset === null ? undefined : Number(offset);
};

// Ganti error.message jadi pesan yang mudah dipahami user
api.interceptors.response.use(
  (response) => response,
  (error) => {
    error.message = getErrorMessage(error);
    return Promise.reject(error);
  }
);
