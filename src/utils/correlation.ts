export function correl(x: number[], y: number[]) {
  if (x.length !== y.length) return 0
  const n = x.length
  const meanX = x.reduce((a, b) => a + b, 0) / n
  const meanY = y.reduce((a, b) => a + b, 0) / n

  const numerator = x.reduce((acc, _, i) => acc + (x[i] - meanX) * (y[i] - meanY), 0)
  const denomX = Math.sqrt(x.reduce((acc, xi) => acc + (xi - meanX) ** 2, 0))
  const denomY = Math.sqrt(y.reduce((acc, yi) => acc + (yi - meanY) ** 2, 0))

  return denomX && denomY ? numerator / (denomX * denomY) : 0
}