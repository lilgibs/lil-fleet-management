import { useInfiniteQuery } from "@tanstack/react-query";
import { getOffset } from "../../../shared/api";
import { getVehicles } from "../../vehicle/api/vehicle.api";
import type { Trip } from "./trip.types";

// /trips berisi semua trip terjadwal (rute Red ±2000, yang beroperasi ±20), jadi opsi diambil dari armada yang sedang jalan
export const useGetTrips = (routeIds: string[], options?: { enabled?: boolean }) => {
    const route = routeIds.join(',')

    return useInfiniteQuery({
        queryKey: ['trips', route],
        queryFn: ({ pageParam, signal }) => getVehicles(
            { 'filter[route]': route, 'page[offset]': pageParam, 'page[limit]': 50, include: 'trip', 'fields[vehicle]': '', 'fields[trip]': 'headsign,name' },
            { signal },
        ),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => getOffset(lastPage.links?.next),
        // urutan /vehicles tidak stabil antar-request, trip yang sama bisa muncul di dua halaman
        select: (data) => [...new Map(data.pages
            .flatMap((page) => page.included ?? [])
            .filter((item): item is Trip => item.type === 'trip')
            .map((trip) => [trip.id, trip])).values()],
        ...options,
        enabled: route !== '' && (options?.enabled ?? true),
    });
}
