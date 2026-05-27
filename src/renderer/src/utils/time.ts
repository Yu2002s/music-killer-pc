export function formatDuration(duration: number): string {
  if (duration <= 0) return '00:00'
  const minute = Math.floor(duration / 60)
    .toString()
    .padStart(2, '0')
  const second = String(duration % 60).padStart(2, '0')
  return `${minute}:${second}`
}
