import { useForm, useWatch } from "react-hook-form";
import { useGetVehicles } from "../../../entities/vehicle/model/use.get.vehicles";
import { getOffset } from "../../../shared/api";

type FleetForm = {
    page: number
    limit: number
    routes: string[]
    trips: string[]
}

export default function useFleetViewModel() {
    const { control, setValue } = useForm<FleetForm>({
        defaultValues: { page: 1, limit: 5, routes: [], trips: [] }
    })
    const [page, limit, routes, trips] = useWatch({ control, name: ['page', 'limit', 'routes', 'trips'] })

    // Ganti filter / jumlah per halaman selalu kembali ke halaman 1. Rute berubah: trip lama dibuang
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

    // Kalau filter[trip] ada, API mengabaikan filter[route], jadi kirim salah satu saja
    const filter = trips.length
        ? { 'filter[trip]': trips.join(',') }
        : { 'filter[route]': routes.join(',') || undefined }
    const offset = (page - 1) * limit

    const vehicles = useGetVehicles({ ...filter, 'page[offset]': offset, 'page[limit]': limit })

    // MBTA tidak mengirim total data, jadi total = offset halaman terakhir (links.last) + isi
    // halaman terakhir. Saat sedang di halaman terakhir, query-nya sama dengan query utama
    // jadi tidak ada request tambahan. Hasil kosong tidak punya `links`, jadi halaman ini
    // dianggap yang terakhir
    const lastOffset = vehicles.data ? (getOffset(vehicles.data.links?.last) ?? offset) : undefined
    const lastPage = useGetVehicles(
        { ...filter, 'page[offset]': lastOffset, 'page[limit]': limit },
        { enabled: lastOffset !== undefined },
    )

    return {
        vehicles,
        filters: { routes, trips },
        setRoutes,
        setTrips,
        setPage,
        setLimit,
        pagination: {
            page,
            limit,
            totalPages: lastOffset === undefined ? undefined : lastOffset / limit + 1,
            from: offset + 1,
            to: offset + (vehicles.data?.data.length ?? 0),
            total: lastOffset !== undefined && lastPage.data ? lastOffset + lastPage.data.data.length : undefined,
        },
    };
}
