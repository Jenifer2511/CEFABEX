import test from 'node:test'
import assert from 'node:assert/strict'
import { WORD_POINTS, IMAGE_COUNT, chapterAt, tileAt, wordPoints } from '../src/lib/scene.ts'

test('Every CEFABEX letter is formed by image tiles', () => {
  assert.ok(WORD_POINTS.length >= IMAGE_COUNT)
  assert.deepEqual([...new Set(WORD_POINTS.map(p => p.letter))], ['C','E','F','A','B','X'])
  assert.equal(wordPoints('Q').length, 0)
  for (const aspect of [.46, 1, 1.6, 2.3]) {
    const final = WORD_POINTS.map((_, i) => tileAt(i, 1, aspect))
    assert.ok(final.every(t => t.w > 0 && t.h > 0 && t.alpha === 1))
    assert.ok(final.every(t => t.rx === 0 && t.ry === 0 && t.rz === 0))
    assert.ok(final.every(t => Number.isFinite(t.x + t.y + t.z)))
    // Every tile in the resolved word occupies the same focal plane.
    assert.equal(new Set(final.map(t => t.z)).size, 1)
  }
})

test('Atlas mapping uses all 112 original images', () => {
  const images = new Set(WORD_POINTS.map((_, i) => (i * 37) % IMAGE_COUNT))
  assert.equal(images.size, IMAGE_COUNT)
})

test('Scroll advances three phrases, then spiral, then identity', () => {
  assert.deepEqual([0,.14,.3,.5,.8,1].map(chapterAt),[0,1,2,3,4,4])
})

test('Tunnel images move inward as the visitor advances', () => {
  const start = tileAt(14,.01,1.6)
  const later = tileAt(14,.04,1.6)
  assert.ok(later.z < start.z)
})

test('Spiral to word morph is continuous and reversible', () => {
  for (const p of [.52,.69,.76,.94,1]) {
    const before = tileAt(31,p-.00001,1.6)
    const after = tileAt(31,p+.00001,1.6)
    assert.ok(Math.abs(before.x-after.x) < .02)
    assert.ok(Math.abs(before.y-after.y) < .02)
    assert.deepEqual(tileAt(31,p,1.6), tileAt(31,p,1.6))
  }
})
