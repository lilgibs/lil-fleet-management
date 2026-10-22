import { api } from "../../../shared/api"
import type { IApiResponseProps } from "../../../shared/api/types"
import type { Route, RouteParams } from "../model/route.types"

export const getRoutes = async (
    props?: RouteParams,
    opts?: { signal?: AbortSignal }
): Promise<IApiResponseProps<Route[]>> => {
    const { data } = await api.get(`/routes`,
        {
            params: {
                ...props
            },
            signal: opts?.signal
        }
    )
    return data
}
