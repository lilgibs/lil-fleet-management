import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import Fleet from './fleet/ui/Fleet.tsx'

// retry 1: MBTA tanpa API key cuma 20 request/menit
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1 } },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Fleet />
    </QueryClientProvider>
  </StrictMode>,
)
