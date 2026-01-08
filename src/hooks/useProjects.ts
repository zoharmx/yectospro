import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuthStore } from '@/store/useAuthStore'
import { Project } from '@/types'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

export const useProjects = () => {
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)

  // Real-time subscription to projects
  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, 'projects'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const projects = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Project[]

        queryClient.setQueryData(['projects', user.uid], projects)
      },
      (error) => {
        console.error('Error fetching projects:', error)
        toast.error('Error al cargar proyectos')
      }
    )

    return () => unsubscribe()
  }, [user, queryClient])

  // Query for projects
  const projectsQuery = useQuery({
    queryKey: ['projects', user?.uid],
    queryFn: () => [],
    enabled: !!user,
  })

  // Create project mutation
  const createProject = useMutation({
    mutationFn: async (data: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
      if (!user) throw new Error('User not authenticated')

      const projectData = {
        ...data,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      const docRef = await addDoc(collection(db, 'projects'), projectData)
      return docRef.id
    },
    onSuccess: () => {
      toast.success('Proyecto creado exitosamente')
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (error) => {
      console.error('Error creating project:', error)
      toast.error('Error al crear proyecto')
    },
  })

  // Update project mutation
  const updateProject = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Project> }) => {
      const projectRef = doc(db, 'projects', id)
      await updateDoc(projectRef, {
        ...data,
        updatedAt: serverTimestamp(),
      })
    },
    onSuccess: () => {
      toast.success('Proyecto actualizado')
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (error) => {
      console.error('Error updating project:', error)
      toast.error('Error al actualizar proyecto')
    },
  })

  // Delete project mutation
  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, 'projects', id))
    },
    onSuccess: () => {
      toast.success('Proyecto eliminado')
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (error) => {
      console.error('Error deleting project:', error)
      toast.error('Error al eliminar proyecto')
    },
  })

  return {
    projects: projectsQuery.data || [],
    isLoading: projectsQuery.isLoading,
    createProject: createProject.mutate,
    updateProject: updateProject.mutate,
    deleteProject: deleteProject.mutate,
    isCreating: createProject.isPending,
    isUpdating: updateProject.isPending,
    isDeleting: deleteProject.isPending,
  }
}
