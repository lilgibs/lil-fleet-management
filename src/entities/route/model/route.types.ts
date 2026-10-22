import type { IApiRequestProps } from "../../../shared/api/types"

export interface Route {
    attributes: {
        color: string
        // diindeks dengan trip.direction_id
        direction_destinations?: string[]
        direction_names?: string[]
        long_name: string
        short_name: string
        text_color: string
        // GTFS route_type: 0 light rail, 1 subway, 2 commuter rail, 3 bus, 4 ferry
        type: number
    }
    id: string
    type: 'route'
}

export const ROUTE_FIELDS = 'short_name,long_name,color,text_color,type,direction_names,direction_destinations'

export type RouteParams = IApiRequestProps<keyof Route['attributes']> & {
    'fields[route]'?: string
}
