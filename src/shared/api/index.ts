import axios from 'axios';
import { getErrorMessage } from './error';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15_000,
});

export const getOffset = (link?: string) => {
  const offset = link ? new URL(link).searchParams.get('page[offset]') : null;
  return offset === null ? undefined : Number(offset);
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    error.message = getErrorMessage(error);
    return Promise.reject(error);
  }
);
