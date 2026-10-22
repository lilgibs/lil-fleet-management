import { useInfiniteQuery } from "@tanstack/react-query";
import { getOffset } from "../../../shared/api";
import { getRoutes } from "../api/route.api";

export const useGetRoutes = (options?: { enabled?: boolean }) => {
    return useInfiniteQuery({
        queryKey: ['routes'],
        queryFn: ({ pageParam, signal }) => getRoutes(
            { 'page[offset]': pageParam, 'page[limit]': 50, 'fields[route]': 'short_name,long_name' },
            { signal },
        ),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => getOffset(lastPage.links?.next),
        staleTime: Infinity,
        ...options,
    });
}
