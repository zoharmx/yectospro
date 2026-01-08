import { useState } from 'react'
import { motion } from 'framer-motion'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Mail, Lock, User } from 'lucide-react'
import toast from 'react-hot-toast'

interface RegisterFormProps {
  onSwitchToLogin: () => void
}

export const RegisterForm = ({ onSwitchToLogin }: RegisterFormProps) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !password || !confirmPassword) {
      toast.error('Por favor completa todos los campos')
      return
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, { displayName: name })
      toast.success('¡Cuenta creada exitosamente!')
    } catch (error: any) {
      console.error('Registration error:', error)
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Este email ya está registrado')
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Email inválido')
      } else if (error.code === 'auth/weak-password') {
        toast.error('La contraseña es muy débil')
      } else {
        toast.error('Error al crear la cuenta')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gradient mb-2">Crear Cuenta</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Únete a YectosPro y gestiona tus proyectos
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <Input
          type="text"
          label="Nombre completo"
          placeholder="Juan Pérez"
          value={name}
          onChange={(e) => setName(e.target.value)}
          leftIcon={<User className="w-5 h-5" />}
          autoComplete="name"
          disabled={loading}
        />

        <Input
          type="email"
          label="Email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-5 h-5" />}
          autoComplete="email"
          disabled={loading}
        />

        <Input
          type="password"
          label="Contraseña"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="w-5 h-5" />}
          autoComplete="new-password"
          disabled={loading}
        />

        <Input
          type="password"
          label="Confirmar contraseña"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          leftIcon={<Lock className="w-5 h-5" />}
          autoComplete="new-password"
          disabled={loading}
        />

        <Button type="submit" className="w-full" size="lg" isLoading={loading}>
          Crear Cuenta
        </Button>
      </form>

      <p className="text-center mt-6 text-slate-600 dark:text-slate-400">
        ¿Ya tienes una cuenta?{' '}
        <button
          onClick={onSwitchToLogin}
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
        >
          Inicia sesión
        </button>
      </p>
    </motion.div>
  )
}
