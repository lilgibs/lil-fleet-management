import { ArrowUpRight, Clock } from "lucide-react"
import { formatDateTime } from "../../../shared/lib/format"
import type { Route } from "../../route/model/route.types"
import type { Vehicle } from "../model/vehicle.types"
import { formatCoordinate, getVehicleStatus, getVehicleType } from "./vehicle.presentation"

type Props = {
    vehicle: Vehicle
    route?: Route
    onSelect: () => void
}

export default function VehicleCard({ vehicle, route, onSelect }: Props) {
    const { label, current_status, latitude, longitude, updated_at } = vehicle.attributes
    const name = label || vehicle.id
    const { Icon, label: typeLabel } = getVehicleType(route?.attributes.type)
    const status = getVehicleStatus(current_status)
    const routeId = vehicle.relationships.route.data?.id
    const tripId = vehicle.relationships.trip.data?.id
    const routeName = route?.attributes.long_name || route?.attributes.short_name || (routeId ? `Rute ${routeId}` : "Rute belum tersedia")

    return (
        <article className="flex h-full w-full min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-5 transition-[border-color,box-shadow] duration-200 hover:border-accent/30 hover:shadow-md motion-reduce:transition-none">
            <div className="flex items-start gap-3">
                <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                    <Icon aria-hidden className="size-6" strokeWidth={1.6} />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex min-h-6 flex-wrap items-center justify-between gap-x-2 gap-y-1">
                        <p className="text-xs font-medium text-slate-500">{typeLabel}</p>
                        <p title={current_status} className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}>
                            <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-current" />
                            {status.label}
                        </p>
                    </div>
                    <h2 title={name} className="mt-1 line-clamp-2 text-xl leading-7 font-bold tracking-tight text-slate-900 wrap-anywhere">{name}</h2>
                </div>
            </div>

            <div className="mt-4 flex min-h-28 items-start gap-3 rounded-lg bg-slate-50 p-3">
                {route?.attributes.short_name ? (
                    <span className="mt-0.5 grid min-h-8 min-w-8 shrink-0 place-items-center rounded-md px-1.5 text-xs font-bold"
                        style={{ backgroundColor: `#${route.attributes.color}`, color: `#${route.attributes.text_color}` }}>
                        {route.attributes.short_name}
                    </span>
                ) : (
                    <span aria-hidden className="mt-1.5 h-8 w-1 shrink-0 rounded-full bg-slate-300"
                        style={route ? { backgroundColor: `#${route.attributes.color}` } : undefined} />
                )}
                <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium text-slate-500">Rute</p>
                    <p title={routeName} className="mt-0.5 line-clamp-2 text-sm leading-5 font-semibold wrap-anywhere">{routeName}</p>
                    <p title={tripId ? `Trip ${tripId}` : undefined} className="mt-1 truncate text-xs text-slate-500">
                        {tripId ? `Trip ${tripId}` : "Trip belum tersedia"}
                    </p>
                </div>
            </div>

            <dl className="my-4 grid grid-cols-2 divide-x divide-slate-200">
                <div className="min-w-0 pr-3">
                    <dt className="text-[11px] font-medium text-slate-500">Latitude</dt>
                    <dd className="mt-1 text-sm font-medium tabular-nums wrap-anywhere">{formatCoordinate(latitude)}</dd>
                </div>
                <div className="min-w-0 pl-3">
                    <dt className="text-[11px] font-medium text-slate-500">Longitude</dt>
                    <dd className="mt-1 text-sm font-medium tabular-nums wrap-anywhere">{formatCoordinate(longitude)}</dd>
                </div>
            </dl>

            <div className="mt-auto border-t border-slate-100 pt-3">
                <div className="flex items-start gap-2 text-slate-500">
                    <Clock aria-hidden className="mt-0.5 size-3.5 shrink-0" />
                    <div className="min-w-0 text-[11px] leading-5">
                        <span>Update terakhir</span>
                        <time dateTime={updated_at} className="ml-1.5 inline-block text-slate-600">{formatDateTime(updated_at)}</time>
                    </div>
                </div>
                <button type="button" onClick={onSelect} aria-haspopup="dialog"
                    className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent/5 px-3 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-white motion-reduce:transition-none">
                    Lihat detail<span className="sr-only"> armada {name}</span>
                    <ArrowUpRight aria-hidden className="size-4" />
                </button>
            </div>
        </article>
    )
}
