export interface Stop {
    attributes: {
        name: string
        // null untuk halte bus
        platform_name: string | null
    }
    id: string
    type: 'stop'
}

export const STOP_FIELDS = 'name,platform_name'
