import { RefreshCw } from "lucide-react"
import Button from "../../../shared/ui/Button"
import Container from "../../../shared/ui/Container"
import Pagination from "../../../shared/ui/Pagination"
import useFleetViewModel from "../model/useFleetViewModel"
import VehicleFilter from "./VehicleFilter"
import VehicleList from "./VehicleList"

export default function Fleet() {
    const { vehicles, routeById, filters, pagination, setRoutes, setTrips, setPage, setLimit, refreshVehicles, isRefreshing } = useFleetViewModel()
    const goToPage = (page: number) => {
        setPage(page)
        window.scrollTo({ top: 0 })
    }
    const changeLimit = (limit: number) => {
        setLimit(limit)
        window.scrollTo({ top: 0 })
    }

    return (
        <main className="pb-8">
            <Container plain className="flex flex-col gap-4 pt-7 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <h1 className="text-3xl font-bold tracking-tight">Armada</h1>
                    <p className="mt-2 text-sm leading-6 text-slate-500">Pantau posisi, rute, dan status terkini armada MBTA.</p>
                </div>
                <Button onClick={refreshVehicles} disabled={isRefreshing} aria-label="Perbarui data kendaraan" className="shrink-0 self-start gap-2 rounded-lg border-slate-200 sm:self-auto">
                    <RefreshCw aria-hidden className={`size-4 ${isRefreshing ? 'motion-safe:animate-spin' : ''}`} />
                    Perbarui
                </Button>
            </Container>
            <Container className="py-6">
                <VehicleFilter
                    routes={filters.routes}
                    trips={filters.trips}
                    onRoutesChange={setRoutes}
                    onTripsChange={setTrips}
                />
                <div className="mt-6">
                    <div className="mb-4 min-h-5">
                        {vehicles.isSuccess && !vehicles.isPlaceholderData ? (
                            <p role="status" aria-atomic="true" aria-busy={vehicles.isFetching} className="text-sm text-slate-500">
                                Menampilkan <span className="font-semibold text-slate-900 tabular-nums">
                                    {vehicles.data.data.length === 0 ? '0' : `${pagination.from.toLocaleString('id-ID')}–${pagination.to.toLocaleString('id-ID')}`}
                                </span>
                                {vehicles.data.data.length > 0 && pagination.total !== undefined && (
                                    <> dari <span className="font-semibold text-slate-900 tabular-nums">{pagination.total.toLocaleString('id-ID')}</span></>
                                )} kendaraan
                            </p>
                        ) : vehicles.isPending || vehicles.isFetching ? (
                            <div aria-hidden className="h-5 w-56 max-w-full rounded bg-slate-100 motion-safe:animate-pulse" />
                        ) : null}
                    </div>
                    <VehicleList
                        query={vehicles}
                        routeById={routeById}
                        skeletonCount={pagination.limit}
                        hasFilter={filters.routes.length > 0}
                        onResetFilter={() => setRoutes([])}
                    />
                </div>
                {/* pakai isSuccess, saat refetch gagal data lama masih tersimpan */}
                {vehicles.isSuccess && vehicles.data.data.length > 0 && (
                    <div className="mt-6">
                        <Pagination {...pagination} disabled={isRefreshing} onPageChange={goToPage} onLimitChange={changeLimit} />
                    </div>
                )}
            </Container>
        </main>
    )
}
