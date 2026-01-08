import { useState } from 'react'
import { motion } from 'framer-motion'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Mail, Lock, Chrome } from 'lucide-react'
import toast from 'react-hot-toast'

interface LoginFormProps {
  onSwitchToRegister: () => void
  onSwitchToReset: () => void
}

export const LoginForm = ({ onSwitchToRegister, onSwitchToReset }: LoginFormProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Por favor completa todos los campos')
      return
    }

    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast.success('¡Bienvenido de vuelta!')
    } catch (error: any) {
      console.error('Login error:', error)
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        toast.error('Email o contraseña incorrectos')
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Demasiados intentos. Intenta más tarde')
      } else {
        toast.error('Error al iniciar sesión')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      toast.success('¡Bienvenido!')
    } catch (error: any) {
      console.error('Google login error:', error)
      if (error.code !== 'auth/popup-closed-by-user') {
        toast.error('Error al iniciar sesión con Google')
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
        <h1 className="text-4xl font-bold text-gradient mb-2">Bienvenido a YectosPro</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Inicia sesión para gestionar tus proyectos
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
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
          autoComplete="current-password"
          disabled={loading}
        />

        <button
          type="button"
          onClick={onSwitchToReset}
          className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          ¿Olvidaste tu contraseña?
        </button>

        <Button type="submit" className="w-full" size="lg" isLoading={loading}>
          Iniciar Sesión
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-slate-50 dark:bg-slate-950 text-slate-500">o continúa con</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        size="lg"
        onClick={handleGoogleLogin}
        disabled={loading}
        leftIcon={<Chrome className="w-5 h-5" />}
      >
        Google
      </Button>

      <p className="text-center mt-6 text-slate-600 dark:text-slate-400">
        ¿No tienes una cuenta?{' '}
        <button
          onClick={onSwitchToRegister}
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
        >
          Regístrate
        </button>
      </p>
    </motion.div>
  )
}
