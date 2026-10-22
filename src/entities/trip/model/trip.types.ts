import type { IApiRequestProps } from "../../../shared/api/types"

export interface Trip {
    attributes: {
        direction_id: number
        headsign: string
        name: string
        // GTFS: 0 tidak ada info, 1 bisa, 2 tidak bisa
        wheelchair_accessible: number
    }
    id: string
    type: 'trip'
}

export const TRIP_FIELDS = 'headsign,name,direction_id,wheelchair_accessible'

export type TripParams = IApiRequestProps<keyof Trip['attributes']> & {
    // wajib, /trips menolak request tanpa filter
    'filter[route]': string
    'fields[trip]'?: string
}
