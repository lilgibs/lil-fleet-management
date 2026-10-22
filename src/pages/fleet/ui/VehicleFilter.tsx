import { Navigation, Route as RouteIcon, X } from "lucide-react"
import { useState } from "react"
import { useGetRoutes } from "../../../entities/route/model/use.get.routes"
import { useGetTrips } from "../../../entities/trip/model/use.get.trips"
import Button from "../../../shared/ui/Button"
import InfiniteMultiSelect from "../../../shared/ui/InfiniteMultiSelect"

type Props = {
    routes: string[]
    trips: string[]
    onRoutesChange: (ids: string[]) => void
    onTripsChange: (ids: string[]) => void
}

export default function VehicleFilter({ routes, trips, onRoutesChange, onTripsChange }: Props) {
    // Satu dropdown terbuka sekaligus. Data baru diambil saat dropdown dibuka (hemat rate limit 20/menit)
    const [open, setOpen] = useState<'route' | 'trip' | null>(null)
    const routeQuery = useGetRoutes({ enabled: open === 'route' })
    const tripQuery = useGetTrips(routes, { enabled: open === 'trip' })

    const routeOptions = routeQuery.data?.pages.flatMap((page) => page.data).map((route) => ({
        value: route.id,
        label: route.attributes.long_name || route.attributes.short_name,
        hint: route.attributes.short_name,
    })) ?? []
    const tripOptions = tripQuery.data?.pages.flatMap((page) => page.data).map((trip) => ({
        value: trip.id,
        label: trip.attributes.headsign,
        hint: trip.attributes.name || trip.id,
    })) ?? []

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <InfiniteMultiSelect
                label="Rute"
                icon={<RouteIcon aria-hidden className="size-4" />}
                open={open === 'route'}
                onOpenChange={(isOpen) => setOpen(isOpen ? 'route' : null)}
                options={routeOptions}
                selected={routes}
                onChange={onRoutesChange}
                isPending={routeQuery.isPending}
                error={routeQuery.error}
                hasNextPage={routeQuery.hasNextPage}
                isFetchingNextPage={routeQuery.isFetchingNextPage}
                onLoadMore={routeQuery.fetchNextPage}
                onRetry={() => (routeQuery.data ? routeQuery.fetchNextPage() : routeQuery.refetch())}
                emptyText="Tidak ada rute."
            />
            <InfiniteMultiSelect
                label="Trip"
                icon={<Navigation aria-hidden className="size-4" />}
                open={open === 'trip'}
                onOpenChange={(isOpen) => setOpen(isOpen ? 'trip' : null)}
                options={tripOptions}
                selected={trips}
                onChange={onTripsChange}
                isPending={tripQuery.isPending}
                error={tripQuery.error}
                hasNextPage={tripQuery.hasNextPage}
                isFetchingNextPage={tripQuery.isFetchingNextPage}
                onLoadMore={tripQuery.fetchNextPage}
                onRetry={() => (tripQuery.data ? tripQuery.fetchNextPage() : tripQuery.refetch())}
                emptyText="Tidak ada trip untuk rute ini."
                disabledHint={routes.length ? undefined : "Pilih rute dulu"}
            />
            {routes.length > 0 && (
                <Button variant="ghost" onClick={() => onRoutesChange([])} className="self-start sm:self-auto">
                    <X aria-hidden className="size-4" /> Reset filter
                </Button>
            )}
        </div>
    )
}
