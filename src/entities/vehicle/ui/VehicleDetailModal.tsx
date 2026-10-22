import { Clock, ExternalLink, MapPin, RefreshCw, Route as RouteIcon } from "lucide-react"
import { formatDateTime } from "../../../shared/lib/format"
import Button from "../../../shared/ui/Button"
import LocationMap from "../../../shared/ui/LocationMap"
import Modal from "../../../shared/ui/Modal"
import type { Route } from "../../route/model/route.types"
import type { Stop } from "../../stop/model/stop.types"
import type { Trip } from "../../trip/model/trip.types"
import { useGetVehicle } from "../model/use.get.vehicle"
import type { Vehicle } from "../model/vehicle.types"
import { formatCoordinate, getVehicleStatus, getVehicleType } from "./vehicle.presentation"

const WHEELCHAIR: Record<number, string> = { 1: "Bisa", 2: "Tidak bisa" }

type Props = {
    vehicle: Vehicle
    route?: Route
    onClose: () => void
}

export default function VehicleDetailModal({ vehicle: listVehicle, route: listRoute, onClose }: Props) {
    // selama detail dimuat, header pakai data dari card
    const detail = useGetVehicle(listVehicle.id)
    const vehicle = detail.data?.data ?? listVehicle
    const included = detail.data?.included ?? []
    const route = included.find((item): item is Route => item.type === "route") ?? listRoute
    const trip = included.find((item): item is Trip => item.type === "trip")
    const stop = included.find((item): item is Stop => item.type === "stop")

    const { label, current_status, latitude, longitude, current_stop_sequence, updated_at } = vehicle.attributes
    const name = label || vehicle.id
    const { Icon, label: typeLabel } = getVehicleType(route?.attributes.type)
    const status = getVehicleStatus(current_status)
    const routeId = vehicle.relationships.route.data?.id
    const tripId = vehicle.relationships.trip.data?.id
    const direction = trip ? route?.attributes.direction_names[trip.attributes.direction_id] : undefined
    const destination = trip ? route?.attributes.direction_destinations[trip.attributes.direction_id] : undefined
    const hasCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude)
    const isRefreshing = detail.isFetching && !detail.isPending

    // aria-disabled, bukan disabled, supaya fokus keyboard tidak hilang saat refresh
    const refreshButton = (
        <button type="button" aria-label="Perbarui detail kendaraan" aria-disabled={detail.isFetching}
            onClick={() => { if (!detail.isFetching) detail.refetch() }}
            className="group grid size-11 shrink-0 place-items-center rounded-lg text-slate-500 aria-disabled:cursor-wait aria-disabled:opacity-60">
            <span className="grid size-8 place-items-center rounded-md group-hover:bg-slate-100 group-hover:text-slate-900">
                <RefreshCw aria-hidden className={`size-4 ${detail.isFetching ? "motion-safe:animate-spin" : ""}`} />
            </span>
        </button>
    )

    return (
        <Modal title="Detail kendaraan" onClose={onClose} actions={refreshButton}>
            <p role="status" className="sr-only">
                {detail.isPending ? "Memuat detail kendaraan…" : isRefreshing ? "Memperbarui detail kendaraan…" : ""}
            </p>
            <div className="space-y-6 p-5 sm:p-6">
                <div className="flex items-start gap-4">
                    <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                        <Icon aria-hidden className="size-7" strokeWidth={1.6} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-500">{typeLabel}</p>
                        <h3 className="mt-1 text-2xl leading-tight font-bold tracking-tight wrap-anywhere">{name}</h3>
                        <p title={current_status} className={`mt-3 inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}>
                            <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-current" />
                            {status.label}{stop && ` ${stop.attributes.name}`}
                        </p>
                    </div>
                </div>

                {detail.isFetching && (
                    <div aria-hidden className="space-y-4 motion-safe:animate-pulse">
                        <div className="h-20 rounded-xl bg-slate-100" />
                        <div className="grid grid-cols-2 gap-4">
                            {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-10 rounded bg-slate-100" />)}
                        </div>
                        <div className="h-56 rounded-xl bg-slate-100" />
                    </div>
                )}

                {detail.isError && !detail.isFetching && (
                    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm">
                        <p className="font-medium text-red-800">{detail.data ? "Detail kendaraan gagal diperbarui." : "Detail kendaraan gagal dimuat."}</p>
                        <p className="mt-1 text-red-700">{detail.error.message}</p>
                        <Button variant="primary" className="mt-3" onClick={() => detail.refetch()}>Coba lagi</Button>
                    </div>
                )}

                {detail.data && !detail.isFetching && (
                    <>
                        <section aria-labelledby="vehicle-trip-heading">
                            <h3 id="vehicle-trip-heading" className="flex items-center gap-2 text-sm font-semibold">
                                <RouteIcon aria-hidden className="size-4 text-slate-400" /> Perjalanan
                            </h3>
                            <div className="mt-3 flex items-start gap-3 rounded-xl border border-slate-200 p-4">
                                <span aria-hidden className="mt-1 h-10 w-1 shrink-0 rounded-full bg-slate-300"
                                    style={route ? { backgroundColor: `#${route.attributes.color}` } : undefined} />
                                <div className="min-w-0">
                                    <p className="text-[11px] text-slate-500">Rute {route?.attributes.short_name || routeId || "belum tersedia"}</p>
                                    <p className="mt-1 text-sm leading-6 font-semibold wrap-anywhere">{route?.attributes.long_name || route?.attributes.short_name || "Nama rute belum tersedia"}</p>
                                    {trip && <p className="mt-0.5 text-sm text-slate-600">Tujuan {trip.attributes.headsign}</p>}
                                </div>
                            </div>
                            <dl className="mt-4 grid grid-cols-1 gap-4 text-sm min-[400px]:grid-cols-2">
                                <Detail label="ID trip" value={tripId} />
                                <Detail label="Nama trip" value={trip?.attributes.name} />
                                <Detail label="Arah" value={direction && (destination ? `${direction} · ${destination}` : direction)} />
                                <Detail label="Akses kursi roda" value={trip && (WHEELCHAIR[trip.attributes.wheelchair_accessible] ?? "Tidak ada info")} />
                                <Detail label="Halte" value={stop && (stop.attributes.platform_name ? `${stop.attributes.name} (${stop.attributes.platform_name})` : stop.attributes.name)} />
                                <Detail label="Urutan halte" value={current_stop_sequence} />
                                <Detail label="ID kendaraan" value={vehicle.id} />
                            </dl>
                        </section>

                        <section aria-labelledby="vehicle-position-heading" className="border-t border-slate-100 pt-5">
                            <h3 id="vehicle-position-heading" className="flex items-center gap-2 text-sm font-semibold">
                                <MapPin aria-hidden className="size-4 text-slate-400" /> Posisi terakhir
                            </h3>
                            <dl className="mt-3 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 text-sm">
                                <Detail label="Latitude" value={formatCoordinate(latitude)} />
                                <Detail label="Longitude" value={formatCoordinate(longitude)} />
                            </dl>
                            {hasCoordinates && (
                                <>
                                    <div className="mt-3">
                                        <LocationMap latitude={latitude} longitude={longitude} label={`kendaraan ${name}`} />
                                    </div>
                                    <a href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`} target="_blank" rel="noreferrer"
                                        className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent underline-offset-4 hover:underline">
                                        Buka di Google Maps<ExternalLink aria-hidden className="size-3.5" />
                                        <span className="sr-only"> (membuka tab baru)</span>
                                    </a>
                                </>
                            )}
                        </section>
                    </>
                )}

                <div className="flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-3 text-xs leading-5 text-slate-500">
                    <Clock aria-hidden className="mt-0.5 size-4 shrink-0" />
                    <p>Update terakhir <time dateTime={updated_at} className="font-medium text-slate-700">{formatDateTime(updated_at)}</time><br />Sumber data: MBTA V3 API</p>
                </div>
            </div>
        </Modal>
    )
}

function Detail({ label, value }: { label: string, value?: string | number | null }) {
    return (
        <div className="min-w-0">
            <dt className="text-xs text-slate-500">{label}</dt>
            <dd className="mt-1 font-medium tabular-nums wrap-anywhere">{value === null || value === undefined || value === "" ? "Belum tersedia" : value}</dd>
        </div>
    )
}
