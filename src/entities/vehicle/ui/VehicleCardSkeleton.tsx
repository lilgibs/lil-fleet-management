export default function VehicleCardSkeleton() {
    const bar = "rounded bg-slate-200"

    return (
        <div data-skeleton aria-hidden className="flex h-full w-full min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-5 motion-safe:animate-pulse">
            <div className="flex items-start gap-3">
                <div className="size-12 shrink-0 rounded-xl bg-slate-200" />
                <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex min-h-6 flex-wrap items-center justify-between gap-x-2 gap-y-1">
                        <div className={`h-3 w-12 ${bar}`} />
                        <div className="h-6 w-28 rounded-full bg-slate-200" />
                    </div>
                    <div className={`h-6 w-28 ${bar}`} />
                </div>
            </div>
            <div className="mt-4 flex min-h-28 items-start gap-3 rounded-lg bg-slate-50 p-3">
                <div className="size-8 shrink-0 rounded-md bg-slate-200" />
                <div className="flex-1 space-y-2">
                    <div className={`h-3 w-10 ${bar}`} />
                    <div className={`h-4 w-3/4 ${bar}`} />
                    <div className={`h-3 w-1/3 ${bar}`} />
                </div>
            </div>
            <div className="my-4 grid grid-cols-2 gap-6">
                <div className={`h-9 ${bar}`} />
                <div className={`h-9 ${bar}`} />
            </div>
            <div className="mt-auto space-y-3 border-t border-slate-100 pt-3">
                <div className={`h-4 w-2/3 ${bar}`} />
                <div className="h-11 rounded-lg bg-slate-100" />
            </div>
        </div>
    )
}
