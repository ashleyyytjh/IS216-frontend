function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash)
}

export function courseGradient(code: string): string {
  const hash = hashString(code)

  const bucketCount = 36
  const bucket = hash % bucketCount
  const hue1 = (bucket * (360 / bucketCount)) % 360
  const hue2 = (hue1 + 150) % 360

  const saturation = 75
  const lightness1 = 55
  const lightness2 = 60

  return `linear-gradient(135deg,
    hsl(${hue1}, ${saturation}%, ${lightness1}%),
    hsl(${hue2}, ${saturation}%, ${lightness2}%)
  )`
}