import { useGetVehicles } from "../../entities/vehicle/model/use.get.vehicles";

export default function useFleetViewModel() {
    const vehicles = useGetVehicles();

    return {
        vehicles,
    };
}
