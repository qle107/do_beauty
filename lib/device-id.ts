// ─── Persistent first-party device identifier ─────────────────────────────
// A random UUID stored in localStorage on first use, sent with every booking.
// Lets the server recognise the same browser across visits even when the IP
// changes, so a no-show can't simply rebook under a new phone number.
//
// Note: this is a browser-scoped id, NOT a person. It resets if the visitor
// clears site data or uses a different browser/device. That's acceptable — it
// only needs to raise the cost of evading the phone blocklist, not be perfect.

const STORAGE_KEY = 'vynails_device_id'

/**
 * Return this browser's persistent device id, creating one on first call.
 * Returns '' when localStorage is unavailable (private mode, cookies disabled),
 * in which case the booking simply proceeds without device tracking.
 */
export function getDeviceId(): string {
  if (typeof window === 'undefined') return ''
  try {
    let id = window.localStorage.getItem(STORAGE_KEY)
    if (!id) {
      id = crypto.randomUUID()
      window.localStorage.setItem(STORAGE_KEY, id)
    }
    return id
  } catch {
    return ''
  }
}
