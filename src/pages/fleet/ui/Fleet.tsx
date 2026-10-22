import Container from "../../../shared/ui/Container"
import useFleetViewModel from "../model/useFleetViewModel"
import VehicleFilter from "./VehicleFilter"

export default function Fleet() {
    const { filters, setRoutes, setTrips } = useFleetViewModel()

    return (
        <main className="pb-8">
            {/* Judul di luar panel: identitas halaman; panel = permukaan data (filter, grid, pagination) */}
            <Container plain className="pt-6 pb-4">
                <h1 className="text-2xl font-semibold">Kendaraan</h1>
                <p className="mt-1 text-slate-600">Posisi dan status terkini armada MBTA.</p>
            </Container>
            <Container className="py-6">
                <VehicleFilter
                    routes={filters.routes}
                    trips={filters.trips}
                    onRoutesChange={setRoutes}
                    onTripsChange={setTrips}
                />
                <div className="mt-6">Fleet</div>
            </Container>
        </main>
    )
}
