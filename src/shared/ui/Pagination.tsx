import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { getPageItems } from "../lib/pagination"
import Button from "./Button"

type Props = {
    page: number
    totalPages?: number
    limit: number
    limitOptions: number[]
    disabled?: boolean
    onPageChange: (page: number) => void
    onLimitChange: (limit: number) => void
}

export default function Pagination({ page, totalPages, limit, limitOptions, disabled = false, onPageChange, onLimitChange }: Props) {
    const number = (value: number) => value.toLocaleString('id-ID')

    return (
        <nav aria-label="Navigasi halaman kendaraan" aria-busy={disabled}
            className="flex min-w-0 flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-2 sm:gap-4 sm:p-4 xl:flex-row xl:items-center xl:justify-between">
            <label className="flex w-fit items-center gap-2 text-xs text-slate-500">
                Tampilkan
                <span className="relative">
                    <select value={limit} disabled={disabled} aria-label="Jumlah kendaraan per halaman"
                        onChange={(event) => onLimitChange(Number(event.target.value))}
                        className="min-h-11 min-w-17 appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-3 text-sm font-medium text-slate-700 tabular-nums hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50">
                        {limitOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                    <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                </span>
                per halaman
            </label>

            <div className="flex items-center justify-between gap-0.5 border-t border-slate-200 pt-3 sm:hidden">
                <Button square aria-label="Halaman sebelumnya" disabled={disabled || page <= 1}
                    onClick={() => onPageChange(page - 1)} className="max-w-7 shrink-0">
                    <ChevronLeft aria-hidden className="size-4" />
                </Button>
                {totalPages !== undefined && (
                    <ul className="flex items-center justify-center">
                        {getPageItems(page, totalPages, true).map((item, index) => item === "gap" ? (
                            <li key={`gap-${index}`} aria-hidden className="w-5 shrink-0 text-center text-sm text-slate-400">…</li>
                        ) : (
                            <li key={item}>
                                <Button square disabled={disabled} variant={item === page ? "primary" : "ghost"}
                                    aria-current={item === page ? "page" : undefined} aria-label={`Halaman ${item}`}
                                    onClick={() => onPageChange(item)}
                                    className={`max-w-8 text-xs tabular-nums ${item === page ? 'shadow-sm' : 'text-slate-600 hover:bg-slate-200/60 hover:no-underline'}`}>
                                    {number(item)}
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}
                <Button square aria-label="Halaman berikutnya" disabled={disabled || totalPages === undefined || page >= totalPages}
                    onClick={() => onPageChange(page + 1)} className="max-w-7 shrink-0">
                    <ChevronRight aria-hidden className="size-4" />
                </Button>
            </div>

            <div className="hidden items-center justify-end gap-2 border-t border-slate-200 pt-4 sm:flex xl:border-t-0 xl:pt-0">
                <Button square aria-label="Halaman sebelumnya" disabled={disabled || page <= 1} onClick={() => onPageChange(page - 1)}
                    className="shrink-0 xl:w-auto xl:gap-2 xl:px-3">
                    <ChevronLeft aria-hidden className="size-4" />
                    <span className="hidden xl:inline">Sebelumnya</span>
                </Button>

                {totalPages !== undefined ? (
                    <ul className="hidden items-center gap-1 sm:flex">
                        {getPageItems(page, totalPages).map((item, index) => item === "gap" ? (
                            <li key={`gap-${index}`} aria-hidden className="w-6 text-center text-sm text-slate-400">…</li>
                        ) : (
                            <li key={item}>
                                <Button square disabled={disabled} variant={item === page ? "primary" : "ghost"}
                                    aria-current={item === page ? "page" : undefined} aria-label={`Halaman ${item}`}
                                    onClick={() => onPageChange(item)}
                                    className={`rounded-lg tabular-nums ${item === page ? 'shadow-sm' : 'text-slate-600 hover:bg-slate-200/60 hover:no-underline'}`}>
                                    {number(item)}
                                </Button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <span className="hidden text-sm text-slate-500 tabular-nums sm:inline">Halaman {number(page)}</span>
                )}

                <Button square aria-label="Halaman berikutnya" disabled={disabled || totalPages === undefined || page >= totalPages} onClick={() => onPageChange(page + 1)}
                    className="shrink-0 xl:w-auto xl:gap-2 xl:px-3">
                    <span className="hidden xl:inline">Berikutnya</span>
                    <ChevronRight aria-hidden className="size-4" />
                </Button>
            </div>
        </nav>
    )
}
