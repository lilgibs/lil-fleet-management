# Fleet Management

Aplikasi frontend untuk memantau armada kendaraan secara real-time, memakai data publik [MBTA V3 API](https://api-v3.mbta.com/docs/swagger/index.html) (transportasi umum Boston).

## Fitur

- **Daftar kendaraan** dalam bentuk card: label, status, nama pemberhentian, tujuan dan nomor trip, latitude/longitude, dan waktu update terakhir.
- **Pagination**: rentang data yang tampil, pilihan 6/12/24 per halaman, jumlah halaman, dan tombol pindah halaman.
- **Filter Rute dan Trip**: dropdown multi-pilih dengan infinite scroll. Daftar trip hanya berisi trip yang sedang berjalan pada rute yang dipilih.
- **Popup detail**: data rute, trip (tujuan, arah, akses kursi roda), pemberhentian terkait, dan posisi kendaraan di peta (Leaflet + OpenStreetMap).
- **Loading dan error** di halaman, dropdown, dan popup: skeleton saat memuat, pesan error berbahasa Indonesia dengan tombol "Coba lagi".
- Tombol **Perbarui** untuk mengambil ulang posisi kendaraan.

## Menjalankan aplikasi

Prasyarat: Node.js 22 atau lebih baru (dikembangkan dengan Node 22.17) dan npm.

```bash
npm install
npm run dev       # http://localhost:5173
```

Perintah lain:

```bash
npm run build     # type-check + build produksi ke dist/
npm run preview   # menjalankan hasil build
npm run lint
```

Tidak perlu API key. `VITE_API_BASE_URL` sudah diisi di `.env`.

> **Batas request.** Tanpa API key, MBTA membatasi 20 request per menit per IP. Kalau muncul pesan "Terlalu banyak permintaan ke server", tunggu sekitar satu menit.
>
> **Data live.** Jumlah kendaraan mengikuti jam operasional di Boston (UTC−4). Saat dini hari di sana, kendaraan yang aktif sedikit.

## Teknologi

| Kebutuhan | Pilihan |
|---|---|
| UI | React 19 + TypeScript, Vite |
| Styling | Tailwind CSS v4, font Plus Jakarta Sans, ikon lucide-react |
| Pengambilan data | TanStack Query v5 + axios |
| State filter & pagination | React Hook Form (`useForm` + `useWatch`) di view model |
| Peta | Leaflet + react-leaflet, tile OpenStreetMap |

## Arsitektur

Struktur folder mengikuti **Feature-Sliced Design** versi ringkas (tiga layer), dengan pola **view model** di level halaman: komponen UI hanya menampilkan data, sedangkan state dan logika ada di hook.

```
src/
├─ main.tsx                        # QueryClient (retry 1, staleTime 30 detik) + layout
├─ pages/fleet/
│  ├─ model/useFleetViewModel.ts   # state filter & pagination, query kendaraan, hitung total
│  └─ ui/                          # Fleet (halaman), VehicleFilter, VehicleList
├─ entities/                       # satu folder per resource API
│  ├─ vehicle/                     # api, tipe, useGetVehicles, useGetVehicle, card, popup detail
│  ├─ route/                       # api, tipe, useGetRoutes (infinite)
│  ├─ trip/                        # api, tipe, useGetTrips (infinite, trip aktif dari /vehicles)
│  └─ stop/                        # tipe
└─ shared/
   ├─ api/                         # instance axios, pesan error, tipe JSON:API, getOffset
   ├─ lib/                         # format tanggal, logika nomor halaman
   └─ ui/                          # Button, Container, Navbar, Modal, Pagination,
                                   # InfiniteMultiSelect, LocationMap
```

Arah dependensi satu jalur: `pages → entities → shared`.

Alur data halaman: `Fleet` (UI) → `useFleetViewModel` → `useGetVehicles` (React Query) → `getVehicles` (axios) → MBTA API.

## Pengambilan data

- Semua request lewat satu instance axios di `shared/api`. Interceptor-nya mengubah error (timeout, offline, 404, 429, 5xx) menjadi pesan yang mudah dipahami.
- `useQuery` dipakai untuk daftar dan detail kendaraan. `useInfiniteQuery` dipakai untuk dropdown rute dan trip (50 per halaman, halaman berikutnya dari `links.next`, dimuat lewat `IntersectionObserver`).
- Parameter JSON:API dipakai supaya request sedikit dan kecil:
  - `include=route,trip,stop` di daftar kendaraan: rute (nama, warna, jenis), tujuan perjalanan, dan nama pemberhentian sesuai status armada ikut di respons yang sama.
  - `include=route,trip,stop` di popup detail: satu request untuk semua data detail.
  - `fields[...]` hanya meminta atribut yang dipakai.
- Data dropdown baru diambil saat dropdown dibuka. Daftar rute di-cache selama sesi, daftar trip aktif mengikuti cache 30 detik.

## Pagination

Pagination dilakukan di server dengan `page[offset]` dan `page[limit]`. MBTA tidak mengirim total data, hanya `links.first/last/next/prev`, jadi:

- **Jumlah halaman** = offset di `links.last` ÷ limit + 1.
- **Total data** = offset halaman terakhir + jumlah data di halaman terakhir. Halaman terakhir diambil sekali per kombinasi filter dan limit lalu di-cache. Saat sedang berada di halaman terakhir, tidak ada request tambahan.
- Saat pindah halaman, data halaman sebelumnya dipertahankan (`placeholderData`) supaya jumlah halaman tidak berkedip, sementara grid menampilkan skeleton.
- Mengganti filter atau jumlah per halaman selalu kembali ke halaman 1.

## Perilaku API yang perlu diketahui

- `/trips` berisi semua trip terjadwal (rute Red sekitar 2000 trip, yang beroperasi sekitar 20), jadi opsi Trip diambil dari `/vehicles?filter[route]=…&include=trip` agar hanya berisi trip yang sedang berjalan. Karena itu dropdown Trip baru aktif setelah rute dipilih.
- Jika `filter[trip]` dikirim, API mengabaikan `filter[route]`. View model hanya mengirim salah satu (trip bila ada).
- Beberapa ID dikirim sebagai string dipisah koma (`Red,Orange`), bukan array, karena axios mengirim array sebagai `filter[route][]`.
- Data MBTA berisi bus, subway, light rail, kereta komuter, dan ferry. Ikon card mengikuti jenis kendaraan.
- Status (`IN_TRANSIT_TO`, `STOPPED_AT`, `INCOMING_AT`) ditampilkan dalam Bahasa Indonesia. Kode aslinya tetap ada di tooltip.

Profil di navbar adalah mockup karena aplikasi belum memiliki autentikasi.
