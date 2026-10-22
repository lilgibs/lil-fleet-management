import { X } from "lucide-react"
import { useEffect, useId, useRef, type ReactNode } from "react"

type Props = {
    title: string
    onClose: () => void
    actions?: ReactNode
    children: ReactNode
}

export default function Modal({ title, onClose, actions, children }: Props) {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const titleId = useId()

    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return
        const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
        const previousOverflow = document.body.style.overflow
        dialog.showModal()
        document.body.style.overflow = "hidden"
        return () => {
            dialog.close()
            document.body.style.overflow = previousOverflow
            previousFocus?.focus({ preventScroll: true })
        }
    }, [])

    return (
        <dialog ref={dialogRef} aria-labelledby={titleId}
            onCancel={(event) => { event.preventDefault(); onClose() }}
            onClick={(event) => {
                if (event.target !== event.currentTarget) return
                const bounds = event.currentTarget.getBoundingClientRect()
                if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose()
            }}
            className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/45 backdrop:backdrop-blur-sm">
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-100 bg-white px-5 py-3 sm:px-6">
                <h2 id={titleId} className="text-sm font-semibold">{title}</h2>
                <div className="-mr-2 flex shrink-0 items-center gap-1">
                    {actions}
                    <button type="button" onClick={onClose} aria-label="Tutup detail armada"
                        className="grid size-11 shrink-0 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900">
                        <X aria-hidden className="size-5" />
                    </button>
                </div>
            </div>
            {children}
        </dialog>
    )
}
