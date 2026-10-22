import { isAxiosError } from 'axios'

export const getErrorMessage = (error: unknown): string => {
  if (!isAxiosError(error)) return 'Terjadi kesalahan yang tidak terduga.'
  if (error.code === 'ECONNABORTED') return 'Server terlalu lama merespons. Silakan coba lagi.'
  if (!error.response) return 'Tidak dapat terhubung ke server. Periksa koneksi internet lalu coba lagi.'

  const { status } = error.response
  if (status === 404) return 'Data yang diminta tidak ditemukan.'
  // tanpa API key, MBTA membatasi 20 request per menit
  if (status === 429) return 'Terlalu banyak permintaan ke server. Tunggu sekitar satu menit lalu coba lagi.'
  if (status >= 500) return 'Server sedang bermasalah. Silakan coba lagi nanti.'
  return 'Permintaan tidak dapat diproses.'
}
