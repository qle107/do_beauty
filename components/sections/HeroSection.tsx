import Image from 'next/image'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'
import { heroImage } from '@/lib/media'

/**
 * DO BEAUTY hero — one wide architectural photograph of the institut (branded
 * reception + arche + espace de soin). institut-accueil.png is ≈1.88:1.
 *
 * Desktop (lg+): the photo runs full-bleed and the editorial type is set hard
 * into the calm left wall, over a whisper of warm ivory that stays subtle.
 *
 * Mobile / tablet: a wide interior can't be cropped to a portrait slice without
 * burying the type in the busiest part of the room, so we stack instead — the
 * photograph on top (featuring the Do Beauty reception), the copy below on calm
 * ivory. Fully legible, no scrim gymnastics, and the image is never hidden.
 */
function HeroCopy() {
  return (
    <>
      <Reveal>
        <p className="db-eyebrow">Institut de beauté · Gentilly</p>
      </Reveal>
      <Reveal delay={90}>
        <h1
          className="db-display mt-4 text-[color:var(--db-ink)]"
          style={{ fontSize: 'clamp(38px,5.6vw,80px)', lineHeight: 1.04, letterSpacing: '-0.02em' }}
        >
          L&apos;art de la beauté,{' '}
          <span className="db-italic db-champ block pb-[0.08em]">simplement.</span>
        </h1>
      </Reveal>
      <Reveal delay={160}>
        <p className="mt-6 max-w-[27rem] text-[17px] leading-[1.6] text-[color:var(--db-ink-soft)]">
          Manucure, nail art, vernis semi-permanent, beauté du regard et soins du visage. Ouvert 7j/7 à Gentilly.
        </p>
      </Reveal>
      <Reveal delay={220}>
        <div className="mt-8 flex flex-col items-start gap-5">
          <Link
            href="/booking"
            data-cursor="reserver"
            className="db-btn db-btn--solid whitespace-nowrap w-full justify-center sm:w-auto sm:justify-start"
          >
            Réserver un rendez-vous
          </Link>
          <Link href="/#prestations" className="db-linkline whitespace-nowrap">
            Découvrir nos prestations →
          </Link>
        </div>
      </Reveal>
    </>
  )
}

export default function HeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden bg-[color:var(--db-bg)]"
      aria-label="Do Beauty — institut de beauté à Gentilly"
    >
      {/* MOBILE / TABLET — photograph on top, copy on calm ivory below. */}
      <div className="lg:hidden">
        <div className="relative h-[48svh] min-h-[320px] w-full">
          <Image
            src={heroImage}
            alt="Accueil de l'institut Do Beauty à Gentilly — réception et mur signé Do Beauty"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[85%_46%]"
          />
          {/* Soft fade so the photo melts into the ivory copy panel. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-20"
            style={{ background: 'linear-gradient(to bottom, rgba(247,243,236,0) 0%, var(--db-bg) 100%)' }}
          />
        </div>
        <div className="px-6 pb-16 pt-7">
          <HeroCopy />
        </div>
      </div>

      {/* DESKTOP — full-bleed interior with editorial type in the left wall. */}
      <div className="relative hidden min-h-[max(760px,100svh)] lg:block">
        <Image
          src={heroImage}
          alt="Intérieur de l'institut Do Beauty à Gentilly — mur d'accueil, arche cannelée, espace de soin et réception"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_50%]"
        />
        {/* A whisper of warm ivory only behind the text, gone by ~60%. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(247,243,236,0.72) 0%, rgba(247,243,236,0.48) 24%, rgba(247,243,236,0.12) 43%, rgba(247,243,236,0) 62%)',
          }}
        />
        <div className="relative z-10 flex min-h-[max(760px,100svh)] items-center">
          <div className="max-w-[33rem] py-24 pl-16 pr-6 -translate-y-[3vh]">
            <HeroCopy />
          </div>
        </div>
      </div>
    </section>
  )
}
