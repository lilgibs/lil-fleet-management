import { useQuery } from "@tanstack/react-query";
import { ROUTE_FIELDS } from "../../route/model/route.types";
import { STOP_FIELDS } from "../../stop/model/stop.types";
import { TRIP_FIELDS } from "../../trip/model/trip.types";
import { getVehicle } from "../api/vehicle.api";

export const useGetVehicle = (id: string) => {
    return useQuery({
        queryKey: ['vehicle', id],
        queryFn: ({ signal }) => getVehicle(
            id,
            { include: 'route,trip,stop', 'fields[route]': ROUTE_FIELDS, 'fields[trip]': TRIP_FIELDS, 'fields[stop]': STOP_FIELDS },
            { signal },
        ),
    });
}
