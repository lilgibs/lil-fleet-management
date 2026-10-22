import { useQuery } from "@tanstack/react-query";
import { getVehicles } from "../api/vehicle.api";

export const useGetVehicles = () => {
    return useQuery({
        queryKey: ['vehicles'],
        queryFn: () => getVehicles(),
    });
}