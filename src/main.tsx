import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import Fleet from './pages/fleet/ui/Fleet.tsx'
import Navbar from './shared/ui/Navbar.tsx'

// MBTA tanpa API key cuma 20 request/menit
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000, refetchOnWindowFocus: false } },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <Fleet />
    </QueryClientProvider>
  </StrictMode>,
)
