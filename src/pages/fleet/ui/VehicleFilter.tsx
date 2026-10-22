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
    // data baru di-fetch saat dropdown dibuka, supaya tidak boros rate limit
    const [open, setOpen] = useState<'route' | 'trip' | null>(null)
    const routeQuery = useGetRoutes({ enabled: open === 'route' })
    const tripQuery = useGetTrips(routes, { enabled: open === 'trip' })

    const routeOptions = routeQuery.data?.pages.flatMap((page) => page.data).map((route) => ({
        value: route.id,
        label: route.attributes.long_name || route.attributes.short_name,
        hint: route.attributes.short_name,
    })) ?? []
    const tripOptions = tripQuery.data?.map((trip) => ({
        value: trip.id,
        label: trip.attributes.headsign,
        hint: trip.attributes.name || trip.id,
    })) ?? []

    return (
        <section aria-label="Filter armada" className="grid items-end gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
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
                label="Trip aktif"
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
                emptyText="Tidak ada trip aktif untuk rute ini."
                disabledHint={routes.length ? undefined : "Pilih rute dahulu"}
            />
            <Button variant="ghost" disabled={routes.length === 0 && trips.length === 0}
                onClick={() => { setOpen(null); onRoutesChange([]) }}
                className="w-fit gap-1.5 text-xs disabled:no-underline sm:col-span-2 lg:col-span-1">
                <X aria-hidden className="size-3.5" /> Hapus filter
            </Button>
        </section>
    )
}
