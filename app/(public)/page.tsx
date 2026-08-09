import type { Metadata } from 'next'
import HeroSection from '@/components/sections/HeroSection'
import ServicesSection from '@/components/sections/ServicesSection'
import GallerySection from '@/components/sections/GallerySection'
import FaqSection from '@/components/sections/FaqSection'
import BookingCta from '@/components/sections/BookingCta'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <GallerySection />
      <FaqSection />
      <BookingCta />
    </>
  )
}
