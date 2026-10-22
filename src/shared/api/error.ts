import { isAxiosError } from 'axios'

export const getErrorMessage = (error: unknown): string => {
  if (!isAxiosError(error)) return 'An unexpected error occurred.'
  if (error.code === 'ECONNABORTED') return 'The server took too long to respond. Please try again.'
  if (!error.response) return 'Unable to reach the server. Check your connection and try again.'

  const { status } = error.response
  if (status === 404) return 'The requested data could not be found.'
  if (status === 429) return 'Too many requests. Please wait a moment and try again.'
  if (status >= 500) return 'The server could not process the request. Please try again.'
  return 'We could not complete the request.'
}
