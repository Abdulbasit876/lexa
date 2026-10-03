import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | null | undefined, fmt = 'dd MMM yyyy'): string {
  if (!date) return '—'
  try {
    return format(new Date(date), fmt)
  } catch {
    return '—'
  }
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '—'
  try {
    return format(new Date(date), 'dd MMM yyyy, hh:mm a')
  } catch {
    return '—'
  }
}

export function timeAgo(date: Date | string | null | undefined): string {
  if (!date) return '—'
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  } catch {
    return '—'
  }
}

export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return '—'
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return `Rs. ${num.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    YOUTUBE: '▶',
    FACEBOOK: 'f',
    INSTAGRAM: '📷',
    EXTERNAL: '🔗',
  }
  return icons[platform] || '🔗'
}

export function getGrade(percentage: number): string {
  if (percentage >= 90) return 'A+'
  if (percentage >= 80) return 'A'
  if (percentage >= 70) return 'B'
  if (percentage >= 60) return 'C'
  if (percentage >= 50) return 'D'
  return 'F'
}

export function getMonthYear(date: Date | string): string {
  return format(new Date(date), 'MMMM yyyy')
}

export function getCurrentMonth(): string {
  return format(new Date(), 'yyyy-MM')
}

export function getMonthStart(year: number, month: number): Date {
  return new Date(year, month - 1, 1)
}

/**
 * Serializes data returned from Prisma so it can be safely passed across
 * the Next.js Server → Client Component boundary.
 * Converts Decimal → number, Date → ISO string, and strips any other
 * non-plain-object values that Next.js cannot serialize.
 */
export function serialize<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_key, value) => {
      // Prisma Decimal objects expose a `toNumber()` method and have a
      // constructor named "Decimal" (from the `decimal.js` package).
      if (
        value !== null &&
        typeof value === 'object' &&
        typeof value.toFixed === 'function' &&
        typeof value.toNumber === 'function'
      ) {
        return Number(value)
      }
      return value
    })
  )
}
