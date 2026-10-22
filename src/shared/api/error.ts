import axios, { isAxiosError } from 'axios'
import type { ApiErrorKind, NormalizedApiError } from './types'

type UnknownRecord = Record<string, unknown>
type ApiErrorCarrier = { apiError?: unknown }

const ERROR_KINDS = new Set<ApiErrorKind>([
  'http',
  'network',
  'timeout',
  'cancelled',
  'unknown',
])

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const cleanMessage = (value: string): string | undefined => {
  const message = value.trim()
  if (!message || message.length > 500 || /<html[\s>]/i.test(message)) return undefined
  return message
}

const collectMessages = (value: unknown, depth = 0): string[] => {
  if (depth > 3) return []

  if (typeof value === 'string') {
    const message = cleanMessage(value)
    return message ? [message] : []
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectMessages(item, depth + 1))
  }

  if (!isRecord(value)) return []

  const messageKeys = [
    'error_message',
    'messages',
    'message',
    'detail',
    'errors',
    'non_field_errors',
  ]

  return messageKeys.flatMap((key) => collectMessages(value[key], depth + 1))
}

const uniqueMessage = (value: unknown): string | undefined => {
  const messages = [...new Set(collectMessages(value))]
  return messages.length > 0 ? messages.join(', ') : undefined
}

const extractResponseMessage = (data: unknown): string | undefined => {
  if (!isRecord(data)) return uniqueMessage(data)

  const directMessage = uniqueMessage(data.messages) ?? uniqueMessage(data.message)
  if (directMessage && directMessage.toLowerCase() !== 'errorvalidation') {
    return directMessage
  }

  return (
    uniqueMessage(data.values) ??
    uniqueMessage(data.errors) ??
    directMessage
  )
}

const getTraceId = (data: unknown): string | undefined => {
  if (!isRecord(data)) return undefined
  const traceId = data.trace_id ?? data.traceId
  return typeof traceId === 'string' && traceId.trim() ? traceId : undefined
}

const getDetails = (data: unknown): unknown => {
  if (!isRecord(data)) return undefined
  return data.values ?? data.errors
}

const fallbackHttpMessage = (status?: number): string => {
  if (status === 400) return 'The request could not be processed.'
  if (status === 401) return 'Your session has expired. Please sign in again.'
  if (status === 403) return 'You do not have permission to perform this action.'
  if (status === 404) return 'The requested data could not be found.'
  if (status === 408 || status === 504) return 'The server took too long to respond. Please try again.'
  if (status === 409) return 'The request conflicts with the current data.'
  if (status === 422) return 'Please review the submitted data.'
  if (status === 429) return 'Too many requests. Please wait and try again.'
  if (status !== undefined && status >= 500) return 'The server could not process the request. Please try again.'
  return 'We could not complete the request.'
}

const isCancelledError = (error: unknown): boolean => {
  if (axios.isCancel(error)) return true
  if (!isRecord(error)) return false
  return error.name === 'AbortError' || error.code === 'ERR_CANCELED'
}

const isTimeoutError = (error: unknown, status?: number): boolean => {
  if (status === 408 || status === 504) return true
  if (!isRecord(error)) return false
  return error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT'
}

const isNormalizedApiError = (value: unknown): value is NormalizedApiError =>
  isRecord(value) &&
  typeof value.name === 'string' &&
  typeof value.message === 'string' &&
  typeof value.kind === 'string' &&
  ERROR_KINDS.has(value.kind as ApiErrorKind) &&
  typeof value.retryable === 'boolean'

export const normalizeApiError = (error: unknown): NormalizedApiError => {
  if (isNormalizedApiError(error)) return error

  if (isRecord(error) && isNormalizedApiError((error as ApiErrorCarrier).apiError)) {
    return (error as ApiErrorCarrier).apiError as NormalizedApiError
  }

  if (isCancelledError(error)) {
    return {
      name: 'CanceledError',
      code: 'ERR_CANCELED',
      message: 'The request was cancelled.',
      kind: 'cancelled',
      retryable: false,
    }
  }

  if (isAxiosError(error)) {
    const status = error.response?.status
    const data: unknown = error.response?.data

    if (isTimeoutError(error, status)) {
      return {
        name: error.name || 'TimeoutError',
        code: error.code,
        message: extractResponseMessage(data) ?? 'The server took too long to respond. Please try again.',
        status,
        kind: 'timeout',
        traceId: getTraceId(data),
        retryable: true,
        details: getDetails(data),
      }
    }

    if (!error.response) {
      return {
        name: error.name || 'NetworkError',
        code: error.code,
        message: 'Unable to reach the server. Check your connection and try again.',
        kind: 'network',
        retryable: true,
      }
    }

    const retryable = status === 425 || status === 429 || (status !== undefined && status >= 500)
    return {
      name: error.name || 'ApiError',
      code: error.code,
      message: extractResponseMessage(data) ?? fallbackHttpMessage(status),
      status,
      kind: 'http',
      traceId: getTraceId(data),
      retryable,
      details: getDetails(data),
    }
  }

  if (error instanceof Error) {
    return {
      name: error.name || 'Error',
      message: cleanMessage(error.message) ?? 'An unexpected error occurred.',
      kind: 'unknown',
      retryable: false,
    }
  }

  return {
    name: 'UnknownError',
    message: 'An unexpected error occurred.',
    kind: 'unknown',
    retryable: false,
  }
}

export const attachApiError = (error: unknown): unknown => {
  const apiError = normalizeApiError(error)

  if (isAxiosError(error)) {
    const carrier = error as typeof error & ApiErrorCarrier
    carrier.apiError = apiError
    error.message = apiError.message
  }

  return error
}

export const getApiError = (error: unknown): NormalizedApiError =>
  normalizeApiError(error)

export const shouldRetryQuery = (failureCount: number, error: unknown): boolean =>
  failureCount < 1 && getApiError(error).retryable
