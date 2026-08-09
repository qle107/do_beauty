import { test } from 'node:test'
import assert from 'node:assert/strict'
import { busyIntervalsFromFree } from './busy.ts'

const OPEN = 600, CLOSE = 1170, STEP = 15
const hhmm = (min: number): string =>
  `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`

// A free map where `cal` is free at every 15-min tick EXCEPT ticks inside any [s,e) busy range.
function freeMapFor(cal: string, busyRanges: [number, number][] = []): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>()
  for (let t = OPEN; t < CLOSE; t += STEP) {
    const inBusy = busyRanges.some(([s, e]) => t >= s && t < e)
    map.set(hhmm(t), new Set<string>(inBusy ? [] : [cal]))
  }
  return map
}

test('free all day → no busy intervals', () => {
  const out = busyIntervalsFromFree(freeMapFor('A'), ['A'], OPEN, CLOSE)
  assert.deepEqual(out['A'], [])
})

test('busy 13:00–14:00 merges four ticks into one interval', () => {
  const out = busyIntervalsFromFree(freeMapFor('A', [[780, 840]]), ['A'], OPEN, CLOSE)
  assert.deepEqual(out['A'], [{ startMin: 780, endMin: 840 }])
})

test('busy until close clamps to closeMin', () => {
  const out = busyIntervalsFromFree(freeMapFor('A', [[1140, CLOSE]]), ['A'], OPEN, CLOSE)
  assert.deepEqual(out['A'], [{ startMin: 1140, endMin: 1170 }])
})

test('calId never listed free → busy all day', () => {
  const out = busyIntervalsFromFree(freeMapFor('A'), ['B'], OPEN, CLOSE)
  assert.deepEqual(out['B'], [{ startMin: 600, endMin: 1170 }])
})
