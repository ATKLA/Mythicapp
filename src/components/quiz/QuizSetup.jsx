import { useState } from 'react'
import { CIV_ORDER, CIV_COLORS, CIV_SIGILS, CIV_META } from '../../data/civilizations'
import { QUESTIONS_POOL } from '../../data/questions'

const LENGTHS = [5, 10, 20]

export function QuizSetup({ onStart }) {
  const [civs, setCivs]     = useState(new Set(CIV_ORDER))
  const [length, setLength] = useState(10)

  const toggle = (id) => {
    setCivs(prev => {
      const next = new Set(prev)
      if (next.has(id) && next.size > 1) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const available      = QUESTIONS_POOL.filter(q => civs.has(q.era)).length
  const effectiveLen   = Math.min(length, available)

  return (
    <section
      aria-labelledby="setup-title"
      className="flex-1 flex items-center justify-center px-6 py-16"
    >
      <div className="w-full max-w-[600px] bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 max-sm:p-6">
        <p className="font-mono text-[0.85rem] tracking-[0.2em] uppercase text-[var(--gold)] opacity-85 mb-2">
          — Configurar desafío
        </p>
        <h2 id="setup-title" className="font-display text-[2.2rem] tracking-wider text-[var(--text)] leading-none mb-1">
          PREPARA TU PRUEBA
        </h2>
        <p className="font-body text-base text-[var(--text-2)] mb-8 leading-relaxed">
          Elige civilizaciones y cantidad de preguntas. El oráculo barajará el resto.
        </p>

        {/* Civilizations */}
        <div className="mb-8">
          <span id="civs-label" className="block font-mono text-[0.85rem] tracking-[0.14em] uppercase text-[var(--text-3)] mb-3">
            Civilizaciones
          </span>
          <div className="grid grid-cols-2 gap-2.5" role="group" aria-labelledby="civs-label">
            {CIV_ORDER.map(id => {
              const on = civs.has(id)
              const color = CIV_COLORS[id]
              return (
                <button
                  key={id}
                  onClick={() => toggle(id)}
                  aria-pressed={on}
                  style={{ '--cc': color }}
                  className={[
                    'flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 text-left',
                    'focus-visible:outline-2 focus-visible:outline-[var(--cc)] focus-visible:outline-offset-2',
                    on
                      ? 'border-[var(--cc)] bg-[color-mix(in_oklab,var(--cc)_8%,transparent)]'
                      : 'border-[var(--border)] hover:border-[var(--border-2)]',
                  ].join(' ')}
                >
                  <span className="text-2xl" style={{ color: on ? color : 'var(--text-3)' }} aria-hidden="true">
                    {CIV_SIGILS[id]}
                  </span>
                  <span className="font-display text-base tracking-wider" style={{ color: on ? color : 'var(--text-2)' }}>
                    {CIV_META[id].fullName.split(' ').pop().toUpperCase()}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Length */}
        <div className="mb-8">
          <span id="len-label" className="block font-mono text-[0.85rem] tracking-[0.14em] uppercase text-[var(--text-3)] mb-3">
            Preguntas
          </span>
          <div className="flex gap-2.5 flex-wrap" role="radiogroup" aria-labelledby="len-label">
            {LENGTHS.map(n => (
              <button
                key={n}
                role="radio"
                aria-checked={length === n}
                onClick={() => setLength(n)}
                disabled={available < n}
                className={[
                  'font-mono text-[0.8rem] tracking-[0.12em] uppercase px-5 py-2.5 rounded-full border transition-all duration-200 min-h-[38px]',
                  'focus-visible:outline-2 focus-visible:outline-[var(--gold)] focus-visible:outline-offset-2',
                  'disabled:opacity-30 disabled:cursor-not-allowed',
                  length === n
                    ? 'bg-[var(--gold-dim)] border-[var(--gold)] text-[var(--gold)]'
                    : 'border-[var(--border)] text-[var(--text-2)] hover:border-[var(--border-2)] hover:text-[var(--text)]',
                ].join(' ')}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => onStart({ civs: [...civs], length: effectiveLen })}
            disabled={effectiveLen < 1}
            className="w-full bg-[var(--gold)] text-[#0B0911] font-body font-semibold text-base py-3.5 rounded-full transition-all duration-200 hover:bg-[var(--gold-2)] hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(255,216,77,0.4)] focus-visible:outline-2 focus-visible:outline-[var(--gold)] focus-visible:outline-offset-4 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            Comenzar prueba
          </button>
          <p className="font-mono text-sm tracking-[0.08em] text-[var(--text-3)]" role="status">
            {available} preguntas disponibles
          </p>
        </div>
      </div>
    </section>
  )
}
