import { BusFront, MapPin, Ship, TrainFront, TrainFrontTunnel, TramFront, type LucideIcon } from "lucide-react"

const VEHICLE_TYPES: Record<number, { label: string, Icon: LucideIcon, className: string }> = {
    0: { label: "Light rail", Icon: TramFront, className: "bg-emerald-50 text-emerald-700" },
    1: { label: "Subway", Icon: TrainFrontTunnel, className: "bg-blue-50 text-blue-700" },
    2: { label: "Kereta komuter", Icon: TrainFront, className: "bg-violet-50 text-violet-700" },
    3: { label: "Bus", Icon: BusFront, className: "bg-amber-50 text-amber-800" },
    4: { label: "Ferry", Icon: Ship, className: "bg-teal-50 text-teal-700" },
}

const STATUSES: Record<string, { label: string, stopLabel: string, className: string }> = {
    IN_TRANSIT_TO: { label: "Dalam perjalanan", stopLabel: "Pemberhentian berikutnya", className: "bg-accent-soft text-accent" },
    INCOMING_AT: { label: "Mendekati", stopLabel: "Pemberhentian berikutnya", className: "bg-amber-50 text-amber-800" },
    STOPPED_AT: { label: "Berhenti", stopLabel: "Pemberhentian saat ini", className: "bg-slate-100 text-slate-600" },
}

export const getVehicleType = (type?: number) =>
    VEHICLE_TYPES[type ?? -1] ?? { label: "Armada", Icon: MapPin, className: "bg-slate-100 text-slate-600" }

export const getVehicleStatus = (status: string) =>
    STATUSES[status] ?? { label: status, stopLabel: "Pemberhentian terkait", className: "bg-slate-100 text-slate-600" }

export const formatCoordinate = (value: number | null | undefined) =>
    typeof value === "number" && Number.isFinite(value) ? value.toFixed(5) : "Belum tersedia"
