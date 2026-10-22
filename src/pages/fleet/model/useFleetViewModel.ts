import { useQueryClient } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { ROUTE_FIELDS, type Route } from "../../../entities/route/model/route.types";
import { useGetVehicles } from "../../../entities/vehicle/model/use.get.vehicles";
import { getOffset } from "../../../shared/api";
import { useDebouncedValue } from "../../../shared/lib/useDebouncedValue";

// kelipatan 3, mengikuti grid 3 kolom
const LIMIT_OPTIONS = [6, 12, 24]

type FleetForm = {
    page: number
    limit: number
    routes: string[]
    trips: string[]
}

export default function useFleetViewModel() {
    const queryClient = useQueryClient()
    const { control, setValue } = useForm<FleetForm>({
        defaultValues: { page: 1, limit: LIMIT_OPTIONS[0], routes: [], trips: [] }
    })
    const [page, limit, routes, trips] = useWatch({ control, name: ['page', 'limit', 'routes', 'trips'] })

    const setPage = (value: number) => setValue('page', value)
    const setLimit = (value: number) => {
        setValue('limit', value)
        setValue('page', 1)
    }
    const setRoutes = (ids: string[]) => {
        setValue('routes', ids)
        setValue('trips', [])
        setValue('page', 1)
    }
    const setTrips = (ids: string[]) => {
        setValue('trips', ids)
        setValue('page', 1)
    }

    // 800ms karena jeda antar-centang lebih lama dari jeda mengetik
    const routeIds = useDebouncedValue(routes.join(','), 800)
    const tripIds = useDebouncedValue(trips.join(','), 800)

    // MBTA mengabaikan filter[route] kalau filter[trip] ikut dikirim
    const filter = tripIds
        ? { 'filter[trip]': tripIds }
        : { 'filter[route]': routeIds || undefined }
    const offset = (page - 1) * limit

    const params = { ...filter, 'page[limit]': limit, include: 'route', 'fields[route]': ROUTE_FIELDS }
    // data sebelumnya dipertahankan hanya saat pindah halaman, bukan saat filter/limit berubah
    const withoutOffset = (key: unknown) => JSON.stringify({ ...(key as object), 'page[offset]': undefined })
    const vehicles = useGetVehicles({ ...params, 'page[offset]': offset }, {
        placeholderData: (previous, previousQuery) =>
            withoutOffset(previousQuery?.queryKey[1]) === withoutOffset(params) ? previous : undefined,
    })
    const routeById = new Map<string, Route>(vehicles.data?.included?.map((route) => [route.id, route]))

    // MBTA tidak mengirim total, jadi dihitung dari halaman terakhir (links.last).
    // Respons kosong tidak punya links, anggap halaman ini yang terakhir
    const lastOffset = vehicles.data ? (getOffset(vehicles.data.links?.last) ?? offset) : undefined
    const lastPage = useGetVehicles(
        { ...params, 'page[offset]': lastOffset },
        { enabled: lastOffset !== undefined },
    )

    return {
        vehicles,
        routeById,
        filters: { routes, trips },
        setRoutes,
        setTrips,
        setPage,
        setLimit,
        refreshVehicles: () => queryClient.invalidateQueries({ queryKey: ['vehicles'] }),
        isRefreshing: vehicles.isFetching || lastPage.isFetching,
        pagination: {
            page,
            limit,
            limitOptions: LIMIT_OPTIONS,
            totalPages: lastOffset === undefined ? undefined : lastOffset / limit + 1,
            from: offset + 1,
            to: offset + (vehicles.data?.data.length ?? 0),
            total: lastOffset !== undefined && lastPage.data ? lastOffset + lastPage.data.data.length : undefined,
        },
    };
}
