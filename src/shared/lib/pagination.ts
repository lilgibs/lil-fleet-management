// getPageItems(6, 11) -> [1, 'gap', 5, 6, 7, 'gap', 11]
export const getPageItems = (current: number, total: number): (number | 'gap')[] => {
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
