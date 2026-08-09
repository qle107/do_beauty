'use client'

import { useState } from 'react'
import Image from 'next/image'

export interface GalleryImage {
  src: string
  alt: string
}

interface GalleryGridProps {
  images: GalleryImage[]
  /** How many images to show before the first "Voir plus" click. */
  initial: number
  /** How many more to reveal per click. */
  step: number
  gridClass: string
  aspectClass: string
  sizes: string
}

export default function GalleryGrid({
  images,
  initial,
  step,
  gridClass,
  aspectClass,
  sizes,
}: GalleryGridProps) {
  const [visible, setVisible] = useState(initial)

  const shown = images.slice(0, visible)
  const remaining = images.length - visible
  const isExpanded = visible >= images.length

  return (
    <>
      <div className={gridClass}>
        {shown.map((img) => (
          <div
            key={img.src}
            className={`photo-tint group relative ${aspectClass} overflow-hidden bg-blush`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes={sizes}
              loading="lazy"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ))}
      </div>

      {images.length > initial && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() =>
              setVisible((v) => (isExpanded ? initial : Math.min(v + step, images.length)))
            }
            className="inline-block border border-dark text-dark text-sm px-12 py-4 tracking-widest font-sans hover:bg-dark hover:text-cream transition-all duration-200"
          >
            {isExpanded ? 'Voir moins' : `Voir plus (${remaining})`}
          </button>
        </div>
      )}
    </>
  )
}
