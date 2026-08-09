'use client'

import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '@/lib/motion'
import styles from './CustomCursor.module.css'

/**
 * Luxury "VIEW" cursor — an ENHANCEMENT, never a dependency.
 *
 * Safety rules (per spec):
 *  - Native cursor stays visible everywhere by default.
 *  - Only over `targetSelector` do we hide the native cursor, and only once this
 *    component has mounted (adds `html.db-cursor-ready`, which the hero CSS keys
 *    the scoped `cursor:none` off). If JS fails, the class is never added → the
 *    native cursor is never hidden.
 *  - Desktop fine-pointer only; disabled on touch and prefers-reduced-motion.
 *  - Single rAF loop with lerp; mousemove only stores coordinates (no rAF churn,
 *    no React state per move).
 */
export default function CustomCursor({ targetSelector }: { targetSelector: string }) {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine || prefersReducedMotion()) return

    const cursor = cursorRef.current
    const target = document.querySelector<HTMLElement>(targetSelector)
    if (!cursor || !target) return

    // Signal the CSS that it's safe to hide the native cursor over the image.
    document.documentElement.classList.add('db-cursor-ready')

    let mouseX = 0
    let mouseY = 0
    let curX = 0
    let curY = 0

    const move = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    const enter = () => cursor.classList.add(styles.active)
    const leave = () => cursor.classList.remove(styles.active)

    let raf = 0
    const tick = () => {
      curX += (mouseX - curX) * 0.15
      curY += (mouseY - curY) * 0.15
      cursor.style.transform = `translate3d(${curX}px, ${curY}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', move)
    target.addEventListener('mouseenter', enter)
    target.addEventListener('mouseleave', leave)
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', move)
      target.removeEventListener('mouseenter', enter)
      target.removeEventListener('mouseleave', leave)
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('db-cursor-ready')
    }
  }, [targetSelector])

  return (
    <div ref={cursorRef} className={styles.cursor} aria-hidden="true">
      <span className={styles.label}>View</span>
    </div>
  )
}
