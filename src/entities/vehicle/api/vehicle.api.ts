import { api } from "../../../shared/api"
import type { IApiResponseProps } from "../../../shared/api/types"
import type { Vehicle } from "../model/vehicle.types"

export const getVehicles = async (
    opts?: { signal?: AbortSignal }
): Promise<IApiResponseProps<Vehicle[] | []>> => {
    const { data } = await api.get(`/vehicles`,
        {
            signal: opts?.signal
        }
    )
    return data
}