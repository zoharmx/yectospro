import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Project, Stage } from '@/types'
import { Plus, X, Check } from 'lucide-react'
import toast from 'react-hot-toast'

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void
  project?: Project | null
  isLoading?: boolean
}

export const ProjectModal = ({ isOpen, onClose, onSave, project, isLoading }: ProjectModalProps) => {
  const [name, setName] = useState('')
  const [client, setClient] = useState('')
  const [totalCost, setTotalCost] = useState('')
  const [amountPaid, setAmountPaid] = useState('')
  const [description, setDescription] = useState('')
  const [stages, setStages] = useState<Stage[]>([])
  const [newStageName, setNewStageName] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')

  useEffect(() => {
    if (project) {
      setName(project.name)
      setClient(project.client)
      setTotalCost(project.totalCost.toString())
      setAmountPaid(project.amountPaid.toString())
      setDescription(project.description || '')
      setStages(project.stages)
      setPriority(project.priority || 'medium')
    } else {
      resetForm()
    }
  }, [project, isOpen])

  const resetForm = () => {
    setName('')
    setClient('')
    setTotalCost('')
    setAmountPaid('')
    setDescription('')
    setStages([])
    setNewStageName('')
    setPriority('medium')
  }

  const addStage = () => {
    if (!newStageName.trim()) {
      toast.error('Ingresa un nombre para la etapa')
      return
    }

    const newStage: Stage = {
      id: Date.now().toString(),
      name: newStageName.trim(),
      completed: false,
      order: stages.length,
    }

    setStages([...stages, newStage])
    setNewStageName('')
  }

  const removeStage = (id: string) => {
    setStages(stages.filter((s) => s.id !== id))
  }

  const toggleStage = (id: string) => {
    setStages(stages.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !client.trim()) {
      toast.error('El nombre y cliente son requeridos')
      return
    }

    const totalCostNum = parseFloat(totalCost) || 0
    const amountPaidNum = parseFloat(amountPaid) || 0

    if (totalCostNum < 0 || amountPaidNum < 0) {
      toast.error('Los montos deben ser positivos')
      return
    }

    if (amountPaidNum > totalCostNum) {
      toast.error('El monto pagado no puede ser mayor al costo total')
      return
    }

    const projectData: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
      name: name.trim(),
      client: client.trim(),
      totalCost: totalCostNum,
      amountPaid: amountPaidNum,
      stages: stages.map((s, index) => ({ ...s, order: index })),
      description: description.trim(),
      priority,
      tags: [],
    }

    onSave(projectData as any)
    onClose()
    resetForm()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project ? 'Editar Proyecto' : 'Nuevo Proyecto'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre del Proyecto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Sitio Web Corporativo"
            required
          />

          <Input
            label="Cliente"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            placeholder="Ej: Empresa XYZ"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Costo Total"
            type="number"
            value={totalCost}
            onChange={(e) => setTotalCost(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />

          <Input
            label="Monto Pagado"
            type="number"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Prioridad
          </label>
          <div className="flex gap-2">
            {(['low', 'medium', 'high'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  priority === p
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {p === 'low' ? 'Baja' : p === 'medium' ? 'Media' : 'Alta'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Descripción
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción del proyecto..."
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Stages */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Etapas del Proyecto
          </label>

          <div className="flex gap-2 mb-3">
            <Input
              value={newStageName}
              onChange={(e) => setNewStageName(e.target.value)}
              placeholder="Nombre de la etapa..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addStage())}
            />
            <Button type="button" onClick={addStage} size="md" leftIcon={<Plus className="w-4 h-4" />}>
              Agregar
            </Button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
            {stages.map((stage) => (
              <div
                key={stage.id}
                className="flex items-center gap-2 p-3 rounded-lg bg-slate-100 dark:bg-slate-800"
              >
                <button
                  type="button"
                  onClick={() => toggleStage(stage.id)}
                  className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    stage.completed
                      ? 'bg-primary-600 border-primary-600'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {stage.completed && <Check className="w-3 h-3 text-white" />}
                </button>
                <span
                  className={`flex-1 ${
                    stage.completed
                      ? 'line-through text-slate-500'
                      : 'text-slate-900 dark:text-slate-100'
                  }`}
                >
                  {stage.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeStage(stage.id)}
                  className="text-rose-500 hover:text-rose-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {stages.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-4">
              No hay etapas agregadas
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" className="flex-1" isLoading={isLoading}>
            {project ? 'Guardar Cambios' : 'Crear Proyecto'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
