import { useQuery } from "@tanstack/react-query";
import { getVehicles } from "../api/vehicle.api";
import type { VehicleParams } from "./vehicle.types";

export const useGetVehicles = (params?: VehicleParams, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: ['vehicles', params],
        queryFn: ({ signal }) => getVehicles(params, { signal }),
        ...options,
    });
}
