import type { IApiRequestProps } from "../../../shared/api/types"

type Relationship = { data: { id: string, type: string } | null }

export interface Vehicle {
    attributes: {
        current_status: string
        current_stop_sequence: number | null
        label: string | null
        latitude: number
        longitude: number
        updated_at: string
    }
    id: string
    relationships: {
        route: Relationship
        stop: Relationship
        trip: Relationship
    }
    type: 'vehicle'
}

export type VehicleParams = IApiRequestProps & {
    'filter[route]'?: string
    'filter[trip]'?: string
    'fields[vehicle]'?: string
    'fields[route]'?: string
    'fields[trip]'?: string
    'fields[stop]'?: string
}
