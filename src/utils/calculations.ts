import { Project, DashboardStats } from '@/types'

export const calculateProgress = (project: Project): number => {
  if (!project.stages || project.stages.length === 0) return 0
  const completed = project.stages.filter((s) => s.completed).length
  return Math.round((completed / project.stages.length) * 100)
}

export const calculatePendingAmount = (project: Project): number => {
  return Math.max(0, project.totalCost - project.amountPaid)
}

export const calculateProjectStatus = (project: Project): Project['status'] => {
  if (project.status) return project.status

  const progress = calculateProgress(project)
  if (progress === 0) return 'not_started'
  if (progress === 100) return 'completed'
  return 'in_progress'
}

export const calculateDashboardStats = (projects: Project[]): DashboardStats => {
  const stats: DashboardStats = {
    totalProjects: projects.length,
    completedProjects: 0,
    inProgressProjects: 0,
    notStartedProjects: 0,
    onHoldProjects: 0,
    totalRevenue: 0,
    paidAmount: 0,
    pendingAmount: 0,
    completionRate: 0,
    averageProjectValue: 0,
  }

  projects.forEach((project) => {
    const status = calculateProjectStatus(project)

    switch (status) {
      case 'completed':
        stats.completedProjects++
        break
      case 'in_progress':
        stats.inProgressProjects++
        break
      case 'not_started':
        stats.notStartedProjects++
        break
      case 'on_hold':
        stats.onHoldProjects++
        break
    }

    stats.totalRevenue += project.totalCost
    stats.paidAmount += project.amountPaid
  })

  stats.pendingAmount = stats.totalRevenue - stats.paidAmount
  stats.completionRate = stats.totalProjects > 0
    ? (stats.completedProjects / stats.totalProjects) * 100
    : 0
  stats.averageProjectValue = stats.totalProjects > 0
    ? stats.totalRevenue / stats.totalProjects
    : 0

  return stats
}

export const sortProjects = (
  projects: Project[],
  field: string,
  direction: 'asc' | 'desc'
): Project[] => {
  return [...projects].sort((a, b) => {
    let aVal: any = a[field as keyof Project]
    let bVal: any = b[field as keyof Project]

    // Handle special cases
    if (field === 'progress') {
      aVal = calculateProgress(a)
      bVal = calculateProgress(b)
    }

    if (aVal instanceof Date || bVal instanceof Date) {
      aVal = aVal?.getTime() || 0
      bVal = bVal?.getTime() || 0
    }

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase()
      bVal = bVal?.toLowerCase() || ''
    }

    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    return direction === 'asc' ? comparison : -comparison
  })
}

export const filterProjects = (
  projects: Project[],
  filters: {
    search?: string
    status?: string[]
    tags?: string[]
    priority?: string[]
  }
): Project[] => {
  return projects.filter((project) => {
    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase()
      const matchesSearch =
        project.name.toLowerCase().includes(search) ||
        project.client.toLowerCase().includes(search) ||
        (project.description?.toLowerCase() || '').includes(search)
      if (!matchesSearch) return false
    }

    // Status filter
    if (filters.status && filters.status.length > 0) {
      const status = calculateProjectStatus(project)
      if (!status || !filters.status.includes(status)) return false
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const hasTag = filters.tags.some((tag) => project.tags?.includes(tag))
      if (!hasTag) return false
    }

    // Priority filter
    if (filters.priority && filters.priority.length > 0) {
      if (!project.priority || !filters.priority.includes(project.priority)) return false
    }

    return true
  })
}
