import type { IApiRequestProps } from "../../../shared/api/types"

export interface Vehicle {
    attributes: {
        bearing: number | null
        carriages: {
            label: string
            occupancy_status: string
            occupancy_percentage?: number
        }[]
        current_status: string
        current_stop_sequence: number | null
        direction_id: number | null
        label: string | null
        latitude: number
        longitude: number
        occupancy_status: string | null
        revenue: string
        speed: number | null
        updated_at: string
    }
    id: string
    links: {
        self: string
    }
    relationships: {
        route: {
            data: {
                id: string
                type: string
            }
        }
        stop: {
            data: {
                id: string
                type: string
            } | null
        }
        trip: {
            data: {
                id: string
                type: string
            }
        }
    }
    type: 'vehicle'
}

export type VehicleParams = IApiRequestProps<keyof Vehicle['attributes']> & {
    'filter[route]'?: string
    'filter[trip]'?: string
    'fields[vehicle]'?: string
    'fields[route]'?: string
    'fields[trip]'?: string
    'fields[stop]'?: string
}
