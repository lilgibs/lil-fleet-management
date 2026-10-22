import { api } from "../../../shared/api"
import type { IApiResponseProps } from "../../../shared/api/types"
import type { Trip, TripParams } from "../model/trip.types"

export const getTrips = async (
    props: TripParams,
    opts?: { signal?: AbortSignal }
): Promise<IApiResponseProps<Trip[]>> => {
    const { data } = await api.get(`/trips`,
        {
            params: {
                ...props
            },
            signal: opts?.signal
        }
    )
    return data
}
