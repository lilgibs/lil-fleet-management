// getPageItems(6, 11) -> [1, 'gap', 5, 6, 7, 'gap', 11]
export const getPageItems = (current: number, total: number, compact = false): (number | 'gap')[] => {
    if (compact) {
        if (total <= 5) return Array.from({ length: total }, (_, index) => index + 1)
        if (current <= 3) return [1, 2, 3, 'gap', total]
        if (current >= total - 2) return [1, 'gap', total - 2, total - 1, total]
        return [1, 'gap', current, 'gap', total]
    }

    const pages = [...new Set([1, current - 1, current, current + 1, total])]
        .filter((page) => page >= 1 && page <= total)
        .sort((a, b) => a - b)

    const items: (number | 'gap')[] = []
    for (const page of pages) {
        const previous = items.at(-1)
        if (typeof previous === 'number' && page - previous === 2) items.push(previous + 1)
        else if (typeof previous === 'number' && page - previous > 2) items.push('gap')
        items.push(page)
    }
    return items
}
