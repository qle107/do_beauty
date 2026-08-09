interface StatsCardProps {
  label: string
  value: number | string
  description?: string
  highlight?: boolean
}

export default function StatsCard({ label, value, description, highlight }: StatsCardProps) {
  return (
    <div className={`p-6 border ${highlight ? 'border-coral bg-coral/5' : 'border-dark/10 bg-cream'}`}>
      <p className="text-xs tracking-[0.25em] uppercase font-sans text-dark/40 mb-3">{label}</p>
      <p className={`font-serif text-5xl font-light mb-2 ${highlight ? 'text-coral' : 'text-dark'}`}>{value}</p>
      {description && <p className="font-sans text-xs text-dark/40">{description}</p>}
    </div>
  )
}
