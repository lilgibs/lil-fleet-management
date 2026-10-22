
export interface IApiRequestProps {
  'page[offset]'?: number;
  'page[limit]'?: number;
  include?: string;
}

// I: tipe item di `included`
export interface IApiResponseProps<T, I = never> {
  data: T;
  included?: I[];
  // prev/next tidak ada di halaman pertama/terakhir
  links?: {
    first?: string
    last?: string
    next?: string
    prev?: string
  }
}
