/**
 * Returns true when the user (or OS) requests reduced motion.
 * Safe on server: returns false when window is undefined.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
