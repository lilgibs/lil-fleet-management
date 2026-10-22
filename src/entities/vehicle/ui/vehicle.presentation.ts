import { BusFront, MapPin, Ship, TrainFront, TrainFrontTunnel, TramFront, type LucideIcon } from "lucide-react"

const VEHICLE_TYPES: Record<number, { label: string, Icon: LucideIcon }> = {
    0: { label: "Light rail", Icon: TramFront },
    1: { label: "Subway", Icon: TrainFrontTunnel },
    2: { label: "Kereta komuter", Icon: TrainFront },
    3: { label: "Bus", Icon: BusFront },
    4: { label: "Ferry", Icon: Ship },
}

const STATUSES: Record<string, { label: string, className: string }> = {
    IN_TRANSIT_TO: { label: "Menuju halte", className: "bg-accent-soft text-accent" },
    INCOMING_AT: { label: "Tiba di halte", className: "bg-amber-50 text-amber-800" },
    STOPPED_AT: { label: "Berhenti di halte", className: "bg-slate-100 text-slate-600" },
}

export const getVehicleType = (type?: number) =>
    VEHICLE_TYPES[type ?? -1] ?? { label: "Armada", Icon: MapPin }

export const getVehicleStatus = (status: string) =>
    STATUSES[status] ?? { label: status, className: "bg-slate-100 text-slate-600" }

export const formatCoordinate = (value: number | null | undefined) =>
    typeof value === "number" && Number.isFinite(value) ? value.toFixed(5) : "Belum tersedia"
