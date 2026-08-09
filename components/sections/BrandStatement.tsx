import Reveal from '@/components/ui/Reveal'

export default function BrandStatement() {
  return (
    <section
      className="bg-[color:var(--db-ink)]"
      style={{ paddingBlock: 'clamp(120px,17vh,200px)' }}
    >
      <div className="db-shell">
        <Reveal className="flex flex-col items-center text-center">
          <span className="db-rule w-12" aria-hidden="true" />

          <p className="db-eyebrow mt-8">L&apos;expérience Do Beauty</p>

          <h2
            className="db-serif mt-8 text-balance"
            style={{
              color: '#FAF8F4',
              fontSize: 'clamp(34px,6vw,78px)',
              lineHeight: 1.06,
              fontWeight: 400,
              letterSpacing: '-0.01em',
            }}
          >
            La beauté n&apos;est pas<br />
            une tendance.<br />
            <span className="db-italic db-champ">C&apos;est un geste.</span>
          </h2>

          <p
            className="mt-8 mx-auto"
            style={{ color: '#DED6CA', maxWidth: '520px' }}
          >
            Un moment pour soi, pensé dans les moindres détails.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
