import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'

export default function BookingCta() {
  return (
    <section className="db-section bg-[#171615]">
      <div className="db-shell">
        <Reveal>
          <div className="mx-auto flex flex-col items-center text-center">
            <p className="db-serif italic text-[color:var(--db-champagne)] text-[clamp(15px,1.6vw,18px)]">
              Votre prochain moment pour vous.
            </p>

            <h2 className="db-serif text-[#FBF8F2] text-[clamp(28px,5.5vw,46px)] leading-tight mt-2">
              Prenez rendez-vous.
            </h2>

            <p className="text-[#E4DCCF] text-[15px] mt-4 max-w-[42ch] mx-auto">
              Réservez votre moment beauté à Gentilly, 7 jours sur 7.
            </p>

            <Link href="/booking" data-cursor="reserver" className="db-btn db-btn--onDark mt-8">
              Réserver un rendez-vous
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
