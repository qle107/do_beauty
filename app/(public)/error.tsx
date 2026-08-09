'use client'

import { useEffect } from 'react'

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Surface the error so a hydration/runtime fault is visible in monitoring
    // instead of silently breaking interactivity.
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-serif text-2xl tracking-[0.15em] text-dark">
        Une erreur est survenue
      </h1>
      <p className="mt-4 max-w-md font-sans text-sm text-charcoal-500">
        Désolée, quelque chose n’a pas fonctionné. Veuillez réessayer.
      </p>
      <button
        onClick={reset}
        className="mt-8 bg-dark px-6 py-2.5 text-xs tracking-widest font-sans text-cream transition-colors duration-200 hover:bg-coral-dark"
      >
        Réessayer
      </button>
    </div>
  )
}
