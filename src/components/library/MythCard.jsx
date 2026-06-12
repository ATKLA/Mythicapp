import { CIV_COLORS, CIV_SIGILS } from '../../data/civilizations'

function readingMinutes(text = '') {
  return Math.max(1, Math.round(text.trim().split(/\s+/).length / 220))
}

const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/>
  </svg>
)
const ChevIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)

export function MythCard({ myth, onClick, delay = 0 }) {
  const color = CIV_COLORS[myth.era]
  const rt = readingMinutes(myth.detalle)

  return (
    <article
      className="
        myth-card relative bg-[var(--card)] border border-[var(--border)] rounded-xl
        flex flex-col gap-3 p-5 cursor-pointer overflow-hidden
        transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]
        focus-within:outline-2 focus-within:outline-offset-2
      "
      style={{
        '--cc': color,
        animation: `fadeUp 0.5s ${delay}ms var(--ease-out) both`,
      }}
    >
<div
        className="absolute left-0 top-0 bottom-0 w-[3px] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{ background: color }}
        aria-hidden="true"
      />

      <div className="flex items-center justify-between gap-2">
        <span
          className="font-mono text-[0.8rem] tracking-[0.12em] uppercase px-3 py-1 rounded-full border"
          style={{ color, borderColor: color, background: `color-mix(in oklab, ${color} 8%, transparent)` }}
        >
          {myth.era}
        </span>
        <span className="flex items-center gap-1 text-[0.8rem] text-[var(--text-3)]">
          <ClockIcon /> {rt} min
        </span>
      </div>

      <h3 className="font-display text-[1.25rem] tracking-[0.03em] text-[var(--text)] leading-snug">
        <button
          onClick={() => onClick(myth)}
          aria-label={`Leer mito: ${myth.titulo}`}
          className="text-left focus-visible:outline-none after:absolute after:inset-0"
        >
          {myth.titulo}
        </button>
      </h3>

      <p className="font-body text-[0.95rem] text-[var(--text-2)] leading-relaxed line-clamp-2 flex-1">
        {myth.resumen}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-[var(--border)] mt-auto">
        <span className="font-mono text-[0.75rem] tracking-[0.14em] uppercase flex items-center gap-1" style={{ color }}>
          Leer <ChevIcon />
        </span>
        <span className="text-lg opacity-40" style={{ color }} aria-hidden="true">{CIV_SIGILS[myth.era]}</span>
      </div>
    </article>
  )
}
