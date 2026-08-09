/**
 * Pure inversion of Planity's "free practitioners per 15-min slot" feed into
 * per-employee BUSY intervals. No app imports (kept alias-free so node:test can
 * run it directly). An employee is BUSY at a tick when they are NOT listed free
 * there (booked, off-shift, or closed); consecutive busy ticks merge.
 */
export interface Interval {
  startMin: number
  endMin: number
}

const hhmm = (min: number): string =>
  `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`

export function busyIntervalsFromFree(
  free: Map<string, Set<string>>,
  calIds: string[],
  openMin: number,
  closeMin: number,
  stepMin = 15,
): Record<string, Interval[]> {
  const out: Record<string, Interval[]> = {}
  for (const cal of calIds) {
    const intervals: Interval[] = []
    let runStart: number | null = null
    for (let t = openMin; t < closeMin; t += stepMin) {
      const freeSet = free.get(hhmm(t))
      const isFree = !!freeSet && freeSet.has(cal)
      if (!isFree) {
        if (runStart === null) runStart = t
      } else if (runStart !== null) {
        intervals.push({ startMin: runStart, endMin: t })
        runStart = null
      }
    }
    if (runStart !== null) intervals.push({ startMin: runStart, endMin: closeMin })
    out[cal] = intervals
  }
  return out
}
