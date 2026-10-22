import type { Route } from "../model/route.types"

export default function RouteBadge({ route }: { route?: Route }) {
    const code = route?.attributes.short_name?.trim()

    if (!route || !code) {
        return (
            <span aria-hidden className="mt-1.5 h-8 w-1 shrink-0 rounded-full bg-slate-300"
                style={route ? { backgroundColor: `#${route.attributes.color}` } : undefined} />
        )
    }

    return (
        <span title={`Rute ${code}`} className="mt-0.5 grid size-10 aspect-square shrink-0 place-items-center overflow-hidden rounded-md p-1 text-xs leading-4 font-bold"
            style={{ backgroundColor: `#${route.attributes.color}`, color: `#${route.attributes.text_color}` }}>
            <span className="line-clamp-2 w-full text-center wrap-anywhere">{code}</span>
        </span>
    )
}
