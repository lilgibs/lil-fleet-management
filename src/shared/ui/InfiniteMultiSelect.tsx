import { ChevronDown, LoaderCircle, X } from "lucide-react"
import { useEffect, useId, useRef, useState, type ReactNode } from "react"
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
    // kalau diisi, dropdown dinonaktifkan dan teks ini yang ditampilkan
    disabledHint?: string
}

export default function InfiniteMultiSelect({
    label, icon, open, onOpenChange, options, selected, onChange,
    isPending, error, hasNextPage, isFetchingNextPage, onLoadMore, onRetry, emptyText, disabledHint,
}: Props) {
    const listId = useId()
    const rootRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLButtonElement>(null)
    const listRef = useRef<HTMLUListElement>(null)
    const sentinelRef = useRef<HTMLLIElement>(null)
    // diambil saat dropdown dibuka, supaya item tidak pindah tempat saat dicentang
    const [pinned, setPinned] = useState<string[]>([])

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

    // jangan observe saat error, kalau tidak request gagal akan diulang terus
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

    const pinnedOptions = pinned.flatMap((value) => options.filter((option) => option.value === value))
    const restOptions = options.filter((option) => !pinned.includes(option.value))

    const renderOption = (option: Option) => (
        <li key={option.value}>
            <label className="flex min-h-11 cursor-pointer items-center gap-3 px-3 py-2 hover:bg-slate-50">
                <input
                    type="checkbox"
                    checked={selected.includes(option.value)}
                    onChange={() => toggle(option.value)}
                    className="size-4 shrink-0 accent-accent"
                />
                <span className="min-w-0 flex-1">{option.label}</span>
                {option.hint && <span className="max-w-24 shrink-0 truncate text-xs text-slate-500">{option.hint}</span>}
            </label>
        </li>
    )

    return (
        <div ref={rootRef} className="relative w-full min-w-0">
            <p id={`${listId}-label`} className="mb-2 text-xs font-medium text-slate-600">{label}</p>
            <button
                ref={triggerRef}
                type="button"
                disabled={disabled}
                aria-expanded={open}
                aria-controls={listId}
                aria-labelledby={`${listId}-label ${listId}-value`}
                onClick={() => {
                    if (!open) setPinned(selected)
                    onOpenChange(!open)
                }}
                className="flex min-h-11 w-full items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 text-left text-sm transition-colors hover:border-slate-400 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100/70 disabled:text-slate-500 motion-reduce:transition-none"
            >
                <span className="shrink-0 text-slate-500">{icon}</span>
                <span id={`${listId}-value`} className="min-w-0 flex-1 truncate">{summary}</span>
                <ChevronDown aria-hidden className={`size-4 shrink-0 text-slate-500 ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div className="absolute inset-x-0 z-20 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
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
                        {pinnedOptions.length > 0 && (
                            <>
                                <li aria-hidden className="px-3 pt-2 pb-1 text-xs font-medium text-slate-500">Dipilih</li>
                                {pinnedOptions.map(renderOption)}
                                {restOptions.length > 0 && <li aria-hidden className="mx-3 my-1 border-t border-slate-200" />}
                            </>
                        )}
                        {restOptions.map(renderOption)}
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
