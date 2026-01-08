import { format, formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Timestamp } from 'firebase/firestore'

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export const formatDate = (date: Date | Timestamp): string => {
  const jsDate = date instanceof Timestamp ? date.toDate() : date
  return format(jsDate, "dd 'de' MMMM, yyyy", { locale: es })
}

export const formatDateShort = (date: Date | Timestamp): string => {
  const jsDate = date instanceof Timestamp ? date.toDate() : date
  return format(jsDate, 'dd/MM/yyyy', { locale: es })
}

export const formatRelativeTime = (date: Date | Timestamp): string => {
  const jsDate = date instanceof Timestamp ? date.toDate() : date
  return formatDistanceToNow(jsDate, { addSuffix: true, locale: es })
}

export const formatPercent = (value: number): string => {
  return `${Math.round(value)}%`
}

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('es-MX').format(value)
}
