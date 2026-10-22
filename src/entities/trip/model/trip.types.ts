import type { IApiRequestProps } from "../../../shared/api/types"

export interface Trip {
    attributes: {
        headsign: string
        name: string
    }
    id: string
    type: 'trip'
}

export type TripParams = IApiRequestProps<keyof Trip['attributes']> & {
    // wajib diisi: API menolak /trips tanpa filter
    'filter[route]': string
    'fields[trip]'?: string
}
