import "leaflet/dist/leaflet.css"
import { CircleMarker, MapContainer, TileLayer } from "react-leaflet"

type Props = {
    latitude: number
    longitude: number
    label: string
}

export default function LocationMap({ latitude, longitude, label }: Props) {
    return (
        // isolate supaya z-index Leaflet tidak menutupi header modal
        <figure className="isolate overflow-hidden rounded-xl border border-slate-200">
            <MapContainer center={[latitude, longitude]} zoom={15} scrollWheelZoom={false} className="h-56 w-full">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* CircleMarker karena ikon marker default Leaflet rusak path-nya di Vite.
                    Warna ditulis langsung (= --color-accent), Leaflet tidak bisa baca CSS variable */}
                <CircleMarker center={[latitude, longitude]} radius={9} pathOptions={{ color: "#ffffff", weight: 3, fillColor: "#30336b", fillOpacity: 1 }} />
            </MapContainer>
            <figcaption className="sr-only">Peta posisi {label}</figcaption>
        </figure>
    )
}