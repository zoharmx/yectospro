import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ViewMode, SortField, SortDirection } from '@/types'

interface UIStore {
  theme: 'light' | 'dark' | 'auto'
  viewMode: ViewMode
  sidebarOpen: boolean
  sortField: SortField
  sortDirection: SortDirection
  setTheme: (theme: 'light' | 'dark' | 'auto') => void
  setViewMode: (mode: ViewMode) => void
  toggleSidebar: () => void
  setSorting: (field: SortField, direction: SortDirection) => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      viewMode: 'grid',
      sidebarOpen: true,
      sortField: 'createdAt',
      sortDirection: 'desc',
      setTheme: (theme) => set({ theme }),
      setViewMode: (mode) => set({ viewMode: mode }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSorting: (field, direction) => set({ sortField: field, sortDirection: direction }),
    }),
    {
      name: 'yectos-ui-storage',
    }
  )
)
