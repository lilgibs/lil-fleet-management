import { ChevronDown, LoaderCircle, X } from "lucide-react"
import { useEffect, useId, useRef, type ReactNode } from "react"
import Button from "./Button"

type Option = { value: string, label: string, hint?: string }

type Props = {
    label: string
    icon: ReactNode
    open: boolean
    onOpenChange: (open: boolean) => void
    options: Option[]
    selected: string[]
    onChange: (values: string[]) => void
    isPending: boolean
    error: Error | null
    hasNextPage: boolean
    isFetchingNextPage: boolean
    onLoadMore: () => void
    onRetry: () => void
    emptyText: string
    // diisi = dropdown nonaktif, teksnya menjelaskan kenapa
    disabledHint?: string
}

// Dropdown multi-select dengan lazy load: halaman berikutnya diambil saat ujung daftar terlihat
export default function InfiniteMultiSelect({
    label, icon, open, onOpenChange, options, selected, onChange,
    isPending, error, hasNextPage, isFetchingNextPage, onLoadMore, onRetry, emptyText, disabledHint,
}: Props) {
    const listId = useId()
    const rootRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLButtonElement>(null)
    const listRef = useRef<HTMLUListElement>(null)
    const sentinelRef = useRef<HTMLLIElement>(null)

    // Tutup saat klik di luar atau Escape (fokus kembali ke tombol)
    useEffect(() => {
        if (!open) return
        const onPointerDown = (e: PointerEvent) => {
            if (!rootRef.current?.contains(e.target as Node)) onOpenChange(false)
        }
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return
            onOpenChange(false)
            triggerRef.current?.focus()
        }
        document.addEventListener('pointerdown', onPointerDown)
        document.addEventListener('keydown', onKeyDown)
        return () => {
            document.removeEventListener('pointerdown', onPointerDown)
            document.removeEventListener('keydown', onKeyDown)
        }
    }, [open, onOpenChange])

    // Ujung daftar terlihat: ambil halaman berikutnya. Berhenti saat error supaya tidak mengulang terus
    useEffect(() => {
        const sentinel = sentinelRef.current
        if (!open || !hasNextPage || isFetchingNextPage || error || !sentinel) return
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) onLoadMore() },
            { root: listRef.current },
        )
        observer.observe(sentinel)
        return () => observer.disconnect()
    }, [open, hasNextPage, isFetchingNextPage, error, onLoadMore])

    const toggle = (value: string) =>
        onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value])

    const disabled = disabledHint !== undefined
    const summary = disabled
        ? disabledHint
        : selected.length ? `${label} (${selected.length})` : `Semua ${label.toLowerCase()}`

    return (
        <div ref={rootRef} className="relative w-full sm:w-72">
            <button
                ref={triggerRef}
                type="button"
                disabled={disabled}
                aria-expanded={open}
                aria-controls={listId}
                onClick={() => onOpenChange(!open)}
                className="flex min-h-11 w-full items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-left text-sm hover:border-slate-400 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
            >
                <span className="shrink-0 text-slate-500">{icon}</span>
                <span className="min-w-0 flex-1 truncate">{summary}</span>
                <ChevronDown aria-hidden className={`size-4 shrink-0 text-slate-500 ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div className="absolute inset-x-0 z-20 mt-1 rounded-md border border-slate-200 bg-white shadow-lg">
                    {selected.length > 0 && (
                        <div className="flex items-center justify-between border-b border-slate-200 px-3 text-sm">
                            <span className="text-slate-600">{selected.length} dipilih</span>
                            <Button variant="ghost" onClick={() => onChange([])}>
                                <X aria-hidden className="size-4" /> Hapus pilihan
                            </Button>
                        </div>
                    )}
                    <ul id={listId} ref={listRef} aria-label={label} className="max-h-72 overflow-y-auto py-1 text-sm">
                        {isPending && !error && (
                            <li className="flex items-center gap-2 px-3 py-3 text-slate-600">
                                <LoaderCircle aria-hidden className="size-4 animate-spin" /> Memuat {label.toLowerCase()}…
                            </li>
                        )}
                        {options.map((option) => (
                            <li key={option.value}>
                                <label className="flex min-h-11 cursor-pointer items-center gap-3 px-3 py-2 hover:bg-slate-50">
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(option.value)}
                                        onChange={() => toggle(option.value)}
                                        className="size-4 shrink-0 accent-accent"
                                    />
                                    {/* Panel selebar tombol: nama panjang turun baris, bukan dipotong */}
                                    <span className="min-w-0 flex-1">{option.label}</span>
                                    {option.hint && <span className="max-w-24 shrink-0 truncate text-xs text-slate-500">{option.hint}</span>}
                                </label>
                            </li>
                        ))}
                        {!isPending && !error && options.length === 0 && (
                            <li className="px-3 py-3 text-slate-600">{emptyText}</li>
                        )}
                        {hasNextPage && !error && (
                            <li ref={sentinelRef} className="flex min-h-8 justify-center py-2 text-slate-500">
                                {isFetchingNextPage && <LoaderCircle aria-label={`Memuat ${label.toLowerCase()} berikutnya`} className="size-4 animate-spin" />}
                            </li>
                        )}
                        {error && (
                            <li className="space-y-1 px-3 py-3">
                                <p className="text-red-700">{error.message}</p>
                                <Button variant="ghost" onClick={onRetry}>Coba lagi</Button>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    )
}
