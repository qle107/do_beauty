'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './CustomCursor.module.css'

type Mode = 'default' | 'link' | 'image' | 'reserver' | 'text'

/**
 * DO BEAUTY custom cursor - a pure enhancement that can NEVER break the native
 * cursor (spec §23).
 *
 * Safety contract:
 *  · Desktop fine-pointer + non-reduced-motion only. On touch / coarse pointers
 *    or reduced-motion the effect returns early, `html.has-db-cursor` is never
 *    added, and the native cursor is left completely untouched.
 *  · The native cursor is hidden ONLY while `html.has-db-cursor` is present, and
 *    that class is stripped the instant the pointer leaves the viewport, the tab
 *    is hidden, or the window loses focus - so a stuck or hidden dot can never
 *    leave the user with no cursor. There is NO static `cursor:none` on
 *    body/html/*; if this JS ever fails, the class is never added → native
 *    cursor stays. That is the guaranteed fallback.
 *  · The dot uses the maximum z-index so overlays/modals/portals can never hide
 *    it (the old bug: a dialog above z-9999 left no visible cursor).
 *  · pointer-events:none → never blocks clicks. Text fields keep the native
 *    I-beam (the dot hides and the CSS opts them out of cursor:none).
 */
export default function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<Mode>('default')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return
    const el = ref.current
    if (!el) return

    const root = document.documentElement
    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let cx = mx
    let cy = my
    let engaged = false

    // Hide the native cursor + reveal the dot. Only ever called while the pointer
    // is genuinely inside the viewport.
    const engage = () => {
      if (engaged) return
      engaged = true
      root.classList.add('has-db-cursor')
      setVisible(true)
    }
    // Restore the native cursor + hide the dot. Called whenever we can no longer
    // guarantee the dot is a valid on-screen cursor.
    const disengage = () => {
      if (!engaged) return
      engaged = false
      root.classList.remove('has-db-cursor')
      setVisible(false)
    }

    let current: Mode = 'default'
    const resolve = (t: EventTarget | null): Mode => {
      const node = t instanceof Element ? t : null
      if (!node) return 'default'
      if (
        node.closest(
          'input:not([type=button]):not([type=submit]):not([type=reset]):not([type=checkbox]):not([type=radio]), textarea, [contenteditable="true"]',
        )
      )
        return 'text'
      const tagged = node.closest<HTMLElement>('[data-cursor]')
      if (tagged?.dataset.cursor) return tagged.dataset.cursor as Mode
      if (node.closest('a, button, [role="button"], summary, label, select')) return 'link'
      return 'default'
    }

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      engage()
    }
    const onOver = (e: MouseEvent) => {
      const m = resolve(e.target)
      if (m !== current) {
        current = m
        setMode(m)
      }
    }

    const onLeave = () => disengage()
    const onBlur = () => disengage()
    const onVisibility = () => {
      if (document.hidden) disengage()
    }

    let raf = 0
    const tick = () => {
      cx += (mx - cx) * 0.18
      cy += (my - cy) * 0.18
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })
    // documentElement mouseleave fires when the pointer leaves the page entirely.
    root.addEventListener('mouseleave', onLeave)
    window.addEventListener('blur', onBlur)
    document.addEventListener('visibilitychange', onVisibility)
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      root.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('blur', onBlur)
      document.removeEventListener('visibilitychange', onVisibility)
      cancelAnimationFrame(raf)
      root.classList.remove('has-db-cursor')
    }
  }, [])

  const label = mode === 'image' ? 'View' : mode === 'reserver' ? 'Réserver' : null
  // Over text fields the native I-beam is the cursor: keep the dot hidden.
  const shown = visible && mode !== 'text'

  return (
    <div
      ref={ref}
      className={`${styles.cursor} ${styles[mode] ?? ''} ${shown ? styles.visible : ''}`}
      aria-hidden="true"
    >
      {label ? <span className={styles.label}>{label}</span> : <span className={styles.dot} />}
    </div>
  )
}
