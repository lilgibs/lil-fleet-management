import type { ComponentProps } from "react"

const variants = {
    primary: "rounded-lg bg-accent text-white hover:bg-accent/90",
    outline: "rounded-lg border border-slate-200 bg-white hover:bg-slate-50",
    ghost: "text-accent hover:underline",
}

type Props = ComponentProps<"button"> & { variant?: keyof typeof variants, square?: boolean }

export default function Button({ variant = "outline", square = false, type = "button", className = "", ...props }: Props) {
    const padding = square ? "w-11" : variant === "ghost" ? "" : "px-4"

    return (
        <button
            type={type}
            className={`inline-flex min-h-11 items-center justify-center gap-1 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${padding} ${className}`}
            {...props}
        />
    )
}
