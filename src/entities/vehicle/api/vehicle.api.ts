import { api } from "../../../shared/api"
import type { IApiRequestProps, IApiResponseProps } from "../../../shared/api/types"
import type { Vehicle } from "../model/vehicle.types"

export const getVehicles = async (
    props?: IApiRequestProps,
    opts?: { signal?: AbortSignal }
): Promise<IApiResponseProps<Vehicle[] | []>> => {
    const { data } = await api.get(`/vehicles`,
        {
            params: {
                ...props
            },
            signal: opts?.signal
        }
    )
    return data
}