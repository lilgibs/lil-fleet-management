// src/shared/api/index.ts
import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import { config } from '../config';
import { useSessionExpiredStore } from '@/entities/session/model/useSessionExpiredStore';
import { attachApiError } from './error';

export { getApiError, normalizeApiError, shouldRetryQuery } from './error';
export type { ApiError, ApiErrorKind, NormalizedApiError } from './types';

const AUTH_STORAGE_KEY = 'gonsters_session';

/**
 * Extended axios config that allows callers to suppress the
 * session-expired modal on a per-request basis.
 *
 * Usage: api.get('/endpoint', { _skipSessionExpiredModal: true })
 */
export interface ApiRequestConfig extends AxiosRequestConfig {
  _skipSessionExpiredModal?: boolean;
}

export const API_TIMEOUTS = {
  default: config.apiRequestTimeoutMs,
  auth: 15_000,
  lookup: 15_000,
  longRunning: 120_000,
} as const;

export const api = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: API_TIMEOUTS.default,
});

const readStoredAccessToken = (): string | null => {
  const sessionJson = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!sessionJson) return null;

  try {
    const session: unknown = JSON.parse(sessionJson);
    if (typeof session !== 'object' || session === null || !("access_token" in session)) {
      return null;
    }

    const accessToken = (session as { access_token?: unknown }).access_token;
    return typeof accessToken === 'string' && accessToken ? accessToken : null;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

// Interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use(
  (reqConfig: InternalAxiosRequestConfig) => {
    const accessToken = readStoredAccessToken();

    // Pastikan session dan token-nya ada
    if (accessToken) {
      if (reqConfig.headers) {
        reqConfig.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return reqConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk menangkap response 401 (session expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const rejectedError = attachApiError(error);

    if (error.response?.status === 401) {
      // Skip modal jika request secara eksplisit meminta suppress
      const skipModal = (error.config as ApiRequestConfig)?._skipSessionExpiredModal;

      // Hanya tampilkan modal jika user sedang authenticated (ada session)
      if (!skipModal && readStoredAccessToken()) {
        useSessionExpiredStore.getState().show();
      }
    }
    return Promise.reject(rejectedError);
  }
);
