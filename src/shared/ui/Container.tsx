import type { ReactNode } from "react"

// `plain` untuk navbar / judul halaman yang tidak berada di dalam panel
export default function Container({ children, className = "", plain = false }: { children: ReactNode, className?: string, plain?: boolean }) {
    return (
        <div className="px-4">
            <div className={`mx-auto max-w-6xl ${plain ? "" : "rounded-lg bg-white p-4 shadow-sm sm:p-6"} ${className}`}>
                {children}
            </div>
        </div>
    )
}
