import { useState } from 'react'
import { motion } from 'framer-motion'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Mail, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

interface ResetPasswordFormProps {
  onBack: () => void
}

export const ResetPasswordForm = ({ onBack }: ResetPasswordFormProps) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error('Por favor ingresa tu email')
      return
    }

    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, email)
      setSent(true)
      toast.success('Email de recuperación enviado')
    } catch (error: any) {
      console.error('Reset password error:', error)
      if (error.code === 'auth/user-not-found') {
        toast.error('No existe una cuenta con este email')
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Email inválido')
      } else {
        toast.error('Error al enviar email de recuperación')
      }
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-10 h-10 text-primary-600 dark:text-primary-400" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Email Enviado</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Te hemos enviado un email con instrucciones para restablecer tu contraseña a{' '}
          <span className="font-medium text-slate-900 dark:text-slate-100">{email}</span>
        </p>
        <Button onClick={onBack} variant="outline" className="w-full">
          Volver al inicio de sesión
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver
      </button>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gradient mb-2">Recuperar Contraseña</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Ingresa tu email y te enviaremos instrucciones
        </p>
      </div>

      <form onSubmit={handleReset} className="space-y-4">
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

        <Button type="submit" className="w-full" size="lg" isLoading={loading}>
          Enviar Instrucciones
        </Button>
      </form>
    </motion.div>
  )
}
