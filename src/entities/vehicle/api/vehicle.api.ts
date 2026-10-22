import { api } from "../../../shared/api"
import type { IApiResponseProps } from "../../../shared/api/types"
import type { Vehicle, VehicleParams } from "../model/vehicle.types"

export const getVehicles = async (
    props?: VehicleParams,
    opts?: { signal?: AbortSignal }
): Promise<IApiResponseProps<Vehicle[]>> => {
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