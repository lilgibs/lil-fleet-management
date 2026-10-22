
export interface IApiRequestProps {
  page?: number;
  limit?: number;
  q?: string;
  sort?: string;
  order?: string;
  date?: string;
}

export type IApiMetaPagination = {
  page: number;
  limit: number;
  totalPages: number;
  displayedRows: number;
  totalRows: number;
  nextPage: number | null;
  prevPage: number | null;
}

export type ApiErrorKind = 'http' | 'network' | 'timeout' | 'cancelled' | 'unknown'

export type ApiError = {
  name?: string
  code?: string
  message?: string
  status?: number
  kind?: ApiErrorKind
  traceId?: string
  retryable?: boolean
  details?: unknown
}

export type NormalizedApiError = ApiError & {
  name: string
  message: string
  kind: ApiErrorKind
  retryable: boolean
}

export interface IApiResponseProps<T> {
  data: T;
}
