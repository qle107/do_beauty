'use client'

import { openConsentBanner } from '@/lib/consent'

// Re-opens the consent banner so the visitor can withdraw or change their
// choice at any time - withdrawal must be as easy as giving consent (CNIL).
export default function ManageCookiesButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openConsentBanner} className={className}>
      Gérer les cookies
    </button>
  )
}
