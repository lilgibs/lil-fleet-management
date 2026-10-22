import { useInfiniteQuery } from "@tanstack/react-query";
import { getOffset } from "../../../shared/api";
import { getTrips } from "../api/trip.api";

export const useGetTrips = (routeIds: string[], options?: { enabled?: boolean }) => {
    const route = routeIds.join(',')

    return useInfiniteQuery({
        queryKey: ['trips', route],
        queryFn: ({ pageParam, signal }) => getTrips(
            { 'filter[route]': route, 'page[offset]': pageParam, 'page[limit]': 50, 'fields[trip]': 'headsign,name' },
            { signal },
        ),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => getOffset(lastPage.links?.next),
        staleTime: Infinity,
        ...options,
        enabled: route !== '' && (options?.enabled ?? true),
    });
}
