// Shared numerical helpers and the local software-image collection.
export const IMAGE_COUNT = 112
export const clamp = (n: number, min = 0, max = 1) => Math.max(min, Math.min(max, n))
export const mix = (a: number, b: number, t: number) => a + (b - a) * t
export function smooth(a: number, b: number, n: number) {
  const t = clamp((n - a) / (b - a))
  return t * t * (3 - 2 * t)
}
