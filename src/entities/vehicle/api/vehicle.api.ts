import { api } from "../../../shared/api"
import type { IApiResponseProps } from "../../../shared/api/types"
import type { Route } from "../../route/model/route.types"
import type { Stop } from "../../stop/model/stop.types"
import type { Trip } from "../../trip/model/trip.types"
import type { Vehicle, VehicleParams } from "../model/vehicle.types"

export const getVehicles = async (
    props?: VehicleParams,
    opts?: { signal?: AbortSignal }
): Promise<IApiResponseProps<Vehicle[], Route>> => {
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

export const getVehicle = async (
    id: string,
    props?: VehicleParams,
    opts?: { signal?: AbortSignal }
): Promise<IApiResponseProps<Vehicle, Route | Trip | Stop>> => {
    const { data } = await api.get(`/vehicles/${encodeURIComponent(id)}`,
        {
            params: {
                ...props
            },
            signal: opts?.signal
        }
    )
    return data
}
