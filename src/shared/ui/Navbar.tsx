import Container from "./Container"

export default function Navbar() {
    return (
        <header className="sticky top-0 z-10 grid h-16 items-center border-b border-slate-200 bg-white shadow-sm sm:h-18">
            <Container plain className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <img src="/logo.png" alt="Lil Gib" width={40} height={40} className="size-10 shrink-0" />
                    <span className="truncate font-semibold">Fleet Management</span>
                </div>
                {/* profil masih mockup, belum ada autentikasi */}
                <div className="flex shrink-0 items-center gap-3">
                    <div className="sr-only text-right sm:not-sr-only">
                        <p className="text-sm leading-tight font-semibold">Operator</p>
                        <p className="text-xs text-slate-500">Pusat Kendali</p>
                    </div>
                    <span aria-hidden className="grid size-10 place-items-center rounded-full bg-accent-soft text-sm font-bold text-accent">
                        OP
                    </span>
                </div>
            </Container>
        </header>
    )
}
