import { Timestamp } from 'firebase/firestore'

export interface Project {
  id: string
  name: string
  client: string
  totalCost: number
  amountPaid: number
  stages: Stage[]
  userId: string
  createdAt: Timestamp
  updatedAt: Timestamp
  tags?: string[]
  color?: string
  priority?: 'low' | 'medium' | 'high'
  status?: 'not_started' | 'in_progress' | 'completed' | 'on_hold'
  dueDate?: Timestamp
  description?: string
}

export interface Stage {
  id: string
  name: string
  completed: boolean
  order: number
  dueDate?: Timestamp
}

export interface Note {
  id: string
  text: string
  createdAt: Timestamp
  updatedAt?: Timestamp
}

export interface Activity {
  id: string
  type: 'created' | 'updated' | 'payment' | 'stage_completed' | 'note_added' | 'status_changed'
  description: string
  timestamp: Timestamp
  metadata?: Record<string, any>
}

export interface User {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

export type ViewMode = 'grid' | 'list' | 'kanban' | 'timeline'

export type SortField = 'name' | 'client' | 'totalCost' | 'amountPaid' | 'createdAt' | 'updatedAt' | 'progress'
export type SortDirection = 'asc' | 'desc'

export interface ProjectFilters {
  search: string
  status: string[]
  tags: string[]
  priority: string[]
  dateRange?: {
    start: Date
    end: Date
  }
}

export interface DashboardStats {
  totalProjects: number
  completedProjects: number
  inProgressProjects: number
  notStartedProjects: number
  onHoldProjects: number
  totalRevenue: number
  paidAmount: number
  pendingAmount: number
  completionRate: number
  averageProjectValue: number
}
