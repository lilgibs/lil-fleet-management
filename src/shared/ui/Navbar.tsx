import logo from "../../assets/logo.png"
import Container from "./Container"

// Satu halaman saja, jadi tidak ada link menu: hanya identitas + sumber data
export default function Navbar() {
    return (
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
            <Container plain className="flex items-center justify-between gap-3 py-2">
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <img src={logo} alt="Lil Gib" width={40} height={40} className="size-10 shrink-0" />
                    <span className="truncate font-semibold">Manajemen Armada</span>
                </div>
                <a
                    href="https://api-v3.mbta.com/docs/swagger/index.html"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 shrink-0 items-center text-sm text-slate-600 underline-offset-4 hover:text-accent hover:underline"
                >
                    <span className="hidden sm:inline">Sumber data:&nbsp;</span>MBTA<span className="hidden sm:inline">&nbsp;V3</span>&nbsp;API
                    <span className="sr-only"> (membuka tab baru)</span>
                </a>
            </Container>
        </header>
    )
}
