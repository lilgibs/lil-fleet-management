const dateTime = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
})

// waktu dari API (Boston, UTC-4) ditampilkan sesuai zona waktu browser
export const formatDateTime = (iso: string) => dateTime.format(new Date(iso))
