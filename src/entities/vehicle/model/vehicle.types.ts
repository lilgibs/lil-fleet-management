export interface Vehicle {
    id: number;
    label: string;
    vehicle_type: 'car' | 'truck';
    registration_number: string;
    current_location: {
        latitude: number;
        longitude: number;
    };
    status: 'moving' | 'stopped' | 'idle';
    vin: string;
    engine_hours: number;
    odometer_km: number;
    fuel_level_percent: number;
    temperature_celsius: number;
    timestamp: string;
}
