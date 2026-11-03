// Scroll-driven interpretation of the user-supplied Originkit Gallery Tunnel.
// One image atlas, one instanced draw call, reversible deterministic choreography.
export const IMAGE_COUNT = 112
export const clamp = (n: number, min = 0, max = 1) => Math.max(min, Math.min(max, n))
export const mix = (a: number, b: number, t: number) => a + (b - a) * t
export function smooth(a: number, b: number, n: number) {
  const t = clamp((n - a) / (b - a))
  return t * t * (3 - 2 * t)
}

const letters: Record<string, string[]> = {
  C: ['01111','11000','11000','11000','11000','11000','01111'],
  E: ['11111','11000','11000','11110','11000','11000','11111'],
  F: ['11111','11000','11000','11110','11000','11000','11000'],
  A: ['01110','11011','11011','11111','11011','11011','11011'],
  B: ['11110','11011','11011','11110','11011','11011','11110'],
  X: ['11011','11011','01110','00100','01110','11011','11011'],
}
export function wordPoints(word = 'CEFABEX') {
  const points: { x: number; y: number; letter: string }[] = []
  const width = word.length * 6 - 1
  for (let l = 0; l < word.length; l++) {
    const pattern = letters[word[l]]
    if (!pattern) continue
    pattern.forEach((row, y) => [...row].forEach((bit, x) => {
      if (bit === '1') points.push({ x: (l * 6 + x - (width - 1) / 2) / width, y: (3 - y) / width, letter: word[l] })
    }))
  }
  return points
}
export const WORD_POINTS = wordPoints()
export function chapterAt(p: number) {
  if (p < 0.135) return 0
  if (p < 0.285) return 1
  if (p < 0.46) return 2
  if (p < 0.76) return 3
  return 4
}
export function tileAt(i: number, progress: number, aspect: number) {
  const p = clamp(progress)
  const n = WORD_POINTS.length
  const layer = Math.floor(i / 7)
  const slot = i % 7
  const angle = slot / 7 * Math.PI * 2 + layer * 0.51 + p * 2.6
  const travel = p * 132
  const z = 7 - ((layer * 3.5 + travel) % 76)
  const radius = 10.8 + Math.sin(i * 3.3) * 1.7
  const tunnelX = Math.cos(angle) * radius * Math.min(aspect, 1.65)
  const tunnelY = Math.sin(angle) * radius * .78
  const spiral = smooth(.52, .69, p)
  const theta = i / n * Math.PI * 10 - smooth(.58, .79, p) * 2.2
  const r = 1.2 + i / n * 8.7
  const sx = Math.cos(theta) * r * Math.min(aspect, 1.5)
  const sy = Math.sin(theta) * r * .75
  const sz = -1 - i / n * 11
  const form = smooth(.76, .94, p)
  const point = WORD_POINTS[i % n]
  const finalWidth = Math.min(27, 19.5 * aspect)
  const finalCell = finalWidth / 41
  return {
    x: mix(mix(tunnelX, sx, spiral), point.x * finalWidth, form),
    y: mix(mix(tunnelY, sy, spiral), point.y * finalWidth, form),
    z: mix(mix(z, sz, spiral), -4 - smooth(.94, 1, p) * 2, form),
    rx: mix(Math.sin(angle) * .13 * (1 - spiral), 0, form),
    ry: mix(Math.cos(angle) * -.25 * (1 - spiral), 0, form),
    rz: mix(mix(Math.sin(i * 11) * .18, theta + Math.PI / 2, spiral), 0, form),
    w: mix(mix(3.45 + (i % 3) * .38, 1.7, spiral), finalCell * .96, form),
    h: mix(mix(2.16 + (i % 3) * .24, 1.06, spiral), finalCell * .96, form),
    alpha: mix(smooth(-42, -6, z) * (1 - smooth(5.5, 7, z)), 1, spiral),
  }
}
