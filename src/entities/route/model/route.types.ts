import type { IApiRequestProps } from "../../../shared/api/types"

export interface Route {
    attributes: {
        long_name: string
        short_name: string
    }
    id: string
    type: 'route'
}

export type RouteParams = IApiRequestProps<keyof Route['attributes']> & {
    'fields[route]'?: string
}
