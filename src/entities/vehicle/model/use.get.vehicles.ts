import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { IApiResponseProps } from "../../../shared/api/types";
import type { Route } from "../../route/model/route.types";
import { getVehicles } from "../api/vehicle.api";
import type { Vehicle, VehicleParams } from "./vehicle.types";

type Options = Omit<UseQueryOptions<IApiResponseProps<Vehicle[], Route>>, 'queryKey' | 'queryFn'>

export const useGetVehicles = (params?: VehicleParams, options?: Options) => {
    return useQuery({
        queryKey: ['vehicles', params],
        queryFn: ({ signal }) => getVehicles(params, { signal }),
        ...options,
    });
}
