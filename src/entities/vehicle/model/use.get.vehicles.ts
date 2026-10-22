import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { IApiResponseProps } from "../../../shared/api/types";
import type { Route } from "../../route/model/route.types";
import type { Stop } from "../../stop/model/stop.types";
import type { Trip } from "../../trip/model/trip.types";
import { getVehicles } from "../api/vehicle.api";
import type { Vehicle, VehicleParams } from "./vehicle.types";

type Options = Omit<UseQueryOptions<IApiResponseProps<Vehicle[], Route | Trip | Stop>>, 'queryKey' | 'queryFn'>

export const useGetVehicles = (params?: VehicleParams, options?: Options) => {
    return useQuery({
        queryKey: ['vehicles', params],
        queryFn: ({ signal }) => getVehicles(params, { signal }),
        ...options,
    });
}
