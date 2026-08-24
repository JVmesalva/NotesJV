export const timeAgo = (
  timestamp: Date | null,
  {
    withAgo,
  }: {
    withAgo?: boolean
  } = {},
): string => {
  if (!timestamp) return "Nunca"

  const diff = Date.now() - new Date(timestamp).getTime()
  const prefix = withAgo ? "há " : ""

  if (diff < 1000) return "agora"

  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return `${prefix}${seconds}s`

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${prefix}${minutes} min`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${prefix}${hours} h`

  return new Date(timestamp).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}
