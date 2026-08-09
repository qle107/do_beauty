import Reveal from '@/components/ui/Reveal'

const testimonials = [
  'Un accueil délicat, une attention incroyable aux détails et un résultat impeccable.',
  'Une adresse rare : précision, douceur et élégance à chaque rendez-vous.',
  'On ressort avec des ongles sublimes et le sentiment d’avoir pris soin de soi.',
]

export default function TestimonialsSection() {
  return (
    <section
      id="avis"
      className="bg-[color:var(--db-ivory)]"
      style={{ paddingTop: 'clamp(88px,12vh,160px)', paddingBottom: 'clamp(88px,12vh,160px)' }}
    >
      <div className="db-shell">
        <Reveal>
          <p className="db-eyebrow">AVIS</p>
          <h2 className="db-display mt-4" style={{ fontSize: 'clamp(28px,4vw,48px)' }}>
            Ce que l&rsquo;on ressent, <span className="db-italic db-champ">ici.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((quote, i) => (
            <Reveal key={i} delay={i * 100}>
              <figure
                className="h-full rounded-[2px] border border-[color:var(--db-line)] bg-[color:var(--db-white)]"
                style={{ padding: 'clamp(28px,3vw,40px)' }}
              >
                <span
                  aria-hidden="true"
                  className="db-serif db-champ text-5xl leading-none block mb-4"
                >
                  &rdquo;
                </span>
                <blockquote>
                  <p
                    className="db-serif italic text-[color:var(--db-ink)]"
                    style={{ fontSize: 'clamp(17px,1.4vw,20px)', lineHeight: 1.5 }}
                  >
                    {quote}
                  </p>
                </blockquote>
                <figcaption
                  className="text-[color:var(--db-taupe)] uppercase text-[11px] mt-6"
                  style={{ letterSpacing: '0.2em' }}
                >
                  Avis Google
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
