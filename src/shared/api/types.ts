
export interface IApiRequestProps {
  'page[offset]'?: number;
  'page[limit]'?: number;
  sort?: "-";
  orderBy?: string;
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

export interface IApiResponseProps<T> {
  data: T;
  links: {
    first: string
    last: string
    next: string
    prev: string
  }
}
