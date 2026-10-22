import type { ComponentProps } from "react"

const variants = {
    primary: "rounded-md bg-accent px-4 text-white hover:bg-teal-800",
    outline: "rounded-md border border-slate-300 bg-white px-4 hover:bg-slate-50",
    ghost: "text-accent hover:underline",
}

type Props = ComponentProps<"button"> & { variant?: keyof typeof variants }

export default function Button({ variant = "outline", type = "button", className = "", ...props }: Props) {
    return (
        <button
            type={type}
            className={`inline-flex min-h-11 items-center justify-center gap-1 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
            {...props}
        />
    )
}
