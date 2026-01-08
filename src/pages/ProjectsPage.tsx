import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useProjects } from '@/hooks/useProjects'
import { useUIStore } from '@/store/useUIStore'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { ProjectModal } from '@/components/projects/ProjectModal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Project } from '@/types'
import { filterProjects, sortProjects } from '@/utils/calculations'
import { Plus, Search, Grid, List, LayoutGrid } from 'lucide-react'

export const ProjectsPage = () => {
  const { projects, isLoading, createProject, updateProject, deleteProject, isCreating, isUpdating } = useProjects()
  const { viewMode, setViewMode } = useUIStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter] = useState<string[]>([])

  const filteredProjects = useMemo(() => {
    let result = filterProjects(projects, {
      search: searchQuery,
      status: statusFilter,
    })
    return sortProjects(result, 'createdAt', 'desc')
  }, [projects, searchQuery, statusFilter])

  const handleCreateOrUpdate = (data: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (selectedProject) {
      updateProject({ id: selectedProject.id, data })
    } else {
      createProject(data)
    }
    setIsModalOpen(false)
    setSelectedProject(null)
  }

  const handleEdit = (project: Project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const handleDelete = (project: Project) => {
    if (window.confirm(`¿Estás seguro de eliminar el proyecto "${project.name}"?`)) {
      deleteProject(project.id)
    }
  }

  const handleNewProject = () => {
    setSelectedProject(null)
    setIsModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <LoadingSpinner size="xl" text="Cargando proyectos..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Proyectos</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Gestiona todos tus proyectos en un solo lugar
          </p>
        </div>
        <Button onClick={handleNewProject} size="lg" leftIcon={<Plus className="w-5 h-5" />}>
          Nuevo Proyecto
        </Button>
      </motion.div>

      {/* Filters and View Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1">
          <Input
            placeholder="Buscar proyectos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-5 h-5" />}
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
            size="md"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-5 h-5" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'ghost'}
            size="md"
            onClick={() => setViewMode('list')}
          >
            <List className="w-5 h-5" />
          </Button>
        </div>
      </motion.div>

      {/* Projects Grid/List */}
      {filteredProjects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <LayoutGrid className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            {searchQuery ? 'No se encontraron proyectos' : 'No hay proyectos aún'}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {searchQuery
              ? 'Intenta con otra búsqueda'
              : 'Comienza creando tu primer proyecto'}
          </p>
          {!searchQuery && (
            <Button onClick={handleNewProject} leftIcon={<Plus className="w-5 h-5" />}>
              Crear Proyecto
            </Button>
          )}
        </motion.div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => handleEdit(project)}
              onDelete={() => handleDelete(project)}
              onClick={() => handleEdit(project)}
              index={index}
            />
          ))}
        </div>
      )}

      {/* Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedProject(null)
        }}
        onSave={handleCreateOrUpdate}
        project={selectedProject}
        isLoading={isCreating || isUpdating}
      />
    </div>
  )
}
