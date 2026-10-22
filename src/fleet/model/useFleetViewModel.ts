import { useForm } from "react-hook-form";
import { useGetVehicles } from "../../entities/vehicle/model/use.get.vehicles";

export default function useFleetViewModel() {
    const { watch, register, setValue } = useForm({
        values: {
            page: 1,
            limit: 5
        }
    })

    const vehicles = useGetVehicles();

    return {
        watch,
        register,
        setValue,
        vehicles,
    };
}
