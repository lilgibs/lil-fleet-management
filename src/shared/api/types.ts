
export interface IApiRequestProps<F extends string = string> {
  'page[offset]'?: number;
  'page[limit]'?: number;
  // ascending: "bearing", descending: "-bearing"
  sort?: F | `-${F}`;
  // contoh: "route,trip,stop"
  include?: string;
}

// I = tipe resource di `included` (hasil param include)
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
