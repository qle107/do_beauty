'use client'

import { useState } from 'react'

// Click-to-load facade for the Google Maps embed. The embedded iframe pulls in
// Google's map runtime (hundreds of KB of JS + tiles); deferring it until the
// visitor actually wants the map keeps it off the initial page load entirely.
// The address and "Itinéraire" link next to it stay in the static HTML, so no
// content is hidden and there is no SEO cost.
export default function MapEmbed() {
  const [loaded, setLoaded] = useState(false)

  if (loaded) {
    return (
      <iframe
        title="Do Beauty - Plan d'accès"
        src="https://maps.google.com/maps?q=16+Avenue+Jean+Jaur%C3%A8s,+94250+Gentilly&z=16&output=embed"
        width="100%"
        height="100%"
        className="absolute inset-0 w-full"
        style={{ border: 0, height: 'calc(100% + 40px)' }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      aria-label="Afficher la carte Google Maps"
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-3 bg-blush hover:bg-blush/80 transition-colors group cursor-pointer"
    >
      <svg
        width="40" height="40" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.25" aria-hidden="true"
        className="text-coral"
      >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
      <span className="font-sans text-xs tracking-[0.2em] uppercase text-charcoal-500 group-hover:text-dark transition-colors">
        Afficher la carte
      </span>
    </button>
  )
}
