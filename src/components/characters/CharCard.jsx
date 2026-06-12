import { CIV_COLORS, CIV_SIGILS } from '../../data/civilizations'

export function CharCard({ char, delay = 0 }) {
  const color = CIV_COLORS[char.era]

  return (
    <article
      className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
      style={{
        '--cc': color,
        animation: `fadeUp 0.5s ${delay}ms var(--ease-out) both`,
      }}
    >
      <div className="flex items-center gap-3.5">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-xl flex-shrink-0 border"
          style={{
            color,
            borderColor: color,
            background: `color-mix(in oklab, ${color} 8%, transparent)`,
            boxShadow: `0 0 16px color-mix(in oklab, ${color} 20%, transparent)`,
          }}
          aria-hidden="true"
        >
          {CIV_SIGILS[char.era]}
        </div>
        <div>
          <h3 className="font-display text-[1.15rem] tracking-[0.03em] text-[var(--text)] leading-none">{char.nombre}</h3>
          <p className="font-mono text-[0.82rem] tracking-[0.1em] uppercase mt-1" style={{ color }}>{char.rol}</p>
        </div>
      </div>
      <p className="font-body text-[0.95rem] text-[var(--text-2)] leading-relaxed">{char.detalle}</p>
    </article>
  )
}
