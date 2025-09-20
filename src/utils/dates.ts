export function formatRelativeMonthYear(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()

  const diffMs = Math.abs(date.getTime() - now.getTime())
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffHours < 24) {
    return `${diffHours}h`
  }
  if (diffDays < 7) {
    return `${diffDays}d`
  }
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks}w`
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months}mo.`
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })
}

export function formatDateString(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}