// Scroll-driven interpretation of the user-supplied Originkit Gallery Tunnel.
// One image atlas, one instanced draw call, reversible deterministic choreography.
export const IMAGE_COUNT = 112
export const clamp = (n: number, min = 0, max = 1) => Math.max(min, Math.min(max, n))
export const mix = (a: number, b: number, t: number) => a + (b - a) * t
export function smooth(a: number, b: number, n: number) {
  const t = clamp((n - a) / (b - a))
  return t * t * (3 - 2 * t)
}

export function chapterAt(p: number) {
  if (p < 0.135) return 0
  if (p < 0.285) return 1
  if (p < 0.46) return 2
  if (p < 0.76) return 3
  return 4
}
