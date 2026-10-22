import type { UseQueryResult } from "@tanstack/react-query"
import { useState } from "react"
import type { Route } from "../../../entities/route/model/route.types"
import type { Stop } from "../../../entities/stop/model/stop.types"
import type { Trip } from "../../../entities/trip/model/trip.types"
import type { Vehicle } from "../../../entities/vehicle/model/vehicle.types"
import VehicleCard from "../../../entities/vehicle/ui/VehicleCard"
import VehicleCardSkeleton from "../../../entities/vehicle/ui/VehicleCardSkeleton"
import VehicleDetailModal from "../../../entities/vehicle/ui/VehicleDetailModal"
import type { IApiResponseProps } from "../../../shared/api/types"
import Button from "../../../shared/ui/Button"

// grid-cols-1 (minmax(0, 1fr)) supaya teks panjang tidak melebarkan kolom
const GRID = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"

type Props = {
    query: UseQueryResult<IApiResponseProps<Vehicle[], Route | Trip | Stop>>
    routeById: Map<string, Route>
    stopById: Map<string, Stop>
    tripById: Map<string, Trip>
    skeletonCount: number
    hasFilter: boolean
    onResetFilter: () => void
}

export default function VehicleList({ query, routeById, stopById, tripById, skeletonCount, hasFilter, onResetFilter }: Props) {
    const [selected, setSelected] = useState<{ vehicle: Vehicle, route?: Route } | null>(null)

    // skeleton juga saat refetch, kecuali modal detail sedang terbuka
    if (query.isPending || ((query.isFetching || query.isPlaceholderData) && !selected)) {
        return (
            <div>
                <p role="status" className="sr-only">Memuat armada…</p>
                <ul aria-busy className={GRID}>
                    {Array.from({ length: skeletonCount }, (_, index) => (
                        <li key={index} className="flex"><VehicleCardSkeleton /></li>
                    ))}
                </ul>
            </div>
        )
    }

    if (query.isError) {
        return (
            <div role="alert" className="py-16 text-center">
                <p className="font-medium">Data armada gagal dimuat.</p>
                <p className="mt-1 text-sm text-slate-600">{query.error.message}</p>
                <Button variant="primary" className="mt-4" onClick={() => query.refetch()}>Coba lagi</Button>
            </div>
        )
    }

    if (query.data.data.length === 0) {
        return (
            <div className="py-16 text-center">
                <p className="font-medium">Tidak ada armada yang cocok.</p>
                <p className="mt-1 text-sm text-slate-600">
                    {hasFilter
                        ? "Rute atau trip yang dipilih mungkin sedang tidak beroperasi."
                        : "Belum ada armada yang beroperasi saat ini."}
                </p>
                {hasFilter && <Button className="mt-4" onClick={onResetFilter}>Reset filter</Button>}
            </div>
        )
    }

    return (
        <>
            <ul className={GRID}>
                {query.data.data.map((vehicle) => (
                    <li key={vehicle.id} className="flex min-w-0">
                        <VehicleCard vehicle={vehicle} route={routeById.get(vehicle.relationships.route.data?.id)}
                            stop={vehicle.relationships.stop.data ? stopById.get(vehicle.relationships.stop.data.id) : undefined}
                            trip={tripById.get(vehicle.relationships.trip.data?.id ?? '')}
                            onSelect={() => setSelected({ vehicle, route: routeById.get(vehicle.relationships.route.data?.id) })} />
                    </li>
                ))}
            </ul>
            {selected && <VehicleDetailModal vehicle={selected.vehicle} route={selected.route} onClose={() => setSelected(null)} />}
        </>
    )
}
