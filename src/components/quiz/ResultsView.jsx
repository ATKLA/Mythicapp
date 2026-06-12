import { useMemo, useEffect } from 'react'
import { CIV_ORDER, CIV_COLORS, CIV_SIGILS, CIV_META } from '../../data/civilizations'
import { AnimatedNumber } from '../ui/AnimatedNumber'

const CheckIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
const XIcon    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>

function getMessage(pct) {
  if (pct === 100) return 'Dominio absoluto de los mitos'
  if (pct >= 80)   return 'Los dioses te reconocen'
  if (pct >= 60)   return 'El conocimiento crece'
  if (pct >= 40)   return 'Los misterios se abren'
  return 'El camino acaba de comenzar'
}

export function ResultsView({ result, onRestart, onHome }) {
  const { score, total, answers } = result
  const pct = Math.round((score / total) * 100)

  const meterColor = pct >= 80 ? 'var(--correct)' : pct >= 50 ? 'var(--gold)' : 'var(--wrong)'

  const byCiv = useMemo(() => {
    const m = {}
    CIV_ORDER.forEach(id => {
      const civA = answers.filter(a => a.era === id)
      if (civA.length) m[id] = { total: civA.length, correct: civA.filter(a => a.ok).length }
    })
    return m
  }, [answers])

  useEffect(() => {
    try {
      const prev = JSON.parse(localStorage.getItem('mythicapp_history') || '[]')
      prev.unshift({ date: Date.now(), score, total, pct })
      localStorage.setItem('mythicapp_history', JSON.stringify(prev.slice(0, 20)))
    } catch {}
  }, [score, total, pct])

  return (
    <section
      aria-labelledby="results-title"
      className="flex-1 max-w-[720px] w-full mx-auto px-6 py-12"
    >
<div className="relative bg-[var(--card)] border border-[var(--border)] rounded-2xl p-10 text-center overflow-hidden mb-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(255,216,77,0.08),transparent_65%)] pointer-events-none" aria-hidden="true" />
        <p className="font-mono text-[0.85rem] tracking-[0.2em] uppercase text-[var(--gold)] opacity-85 mb-4 relative">
          — Resultado del oráculo
        </p>
        <p className="font-display text-[6rem] leading-none text-[var(--gold)] tabular-nums relative" style={{ textShadow: '0 0 40px rgba(255,216,77,0.35)' }}>
          <AnimatedNumber value={score} duration={1400} />
        </p>
        <p className="font-body text-sm text-[var(--text-3)] mt-2 mb-6 relative italic">
          de {total} respuestas correctas · <AnimatedNumber value={pct} duration={1400} />%
        </p>
        <div className="max-w-xs mx-auto h-1 bg-[var(--border)] rounded-full overflow-hidden relative mb-5">
          <div className="h-full rounded-full transition-[width] duration-[1200ms] var(--ease)" style={{ width: `${pct}%`, background: meterColor }} />
        </div>
        <h2 id="results-title" className="font-display text-[1.6rem] tracking-wider text-[var(--text)] relative">
          {getMessage(pct).toUpperCase()}
        </h2>
      </div>
{Object.keys(byCiv).length > 1 && (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 mb-6">
          {Object.entries(byCiv).map(([id, stats]) => {
            const color = CIV_COLORS[id]
            return (
              <div key={id} className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg" style={{ color }} aria-hidden="true">{CIV_SIGILS[id]}</span>
                  <span className="font-mono text-[0.75rem] tracking-wider uppercase text-[var(--text-2)]">
                    {CIV_META[id].fullName.split(' ').pop()}
                  </span>
                </div>
                <p className="font-display text-2xl tracking-wider text-[var(--text)] tabular-nums">{stats.correct}/{stats.total}</p>
                <p className="font-body italic text-xs text-[var(--text-3)] mt-0.5">{Math.round((stats.correct / stats.total) * 100)}% acierto</p>
              </div>
            )
          })}
        </div>
      )}
<div className="flex flex-col gap-3 mb-8">
        <h3 className="font-mono text-[0.78rem] tracking-[0.22em] uppercase text-[var(--text-3)] mb-1">
          Repaso de respuestas
        </h3>
        {answers.map((a, i) => (
          <div
            key={i}
            className={['flex items-start gap-3.5 bg-[var(--card)] border rounded-xl p-4',
              a.ok ? 'border-[color-mix(in_oklab,var(--correct)_40%,var(--border))]'
                   : 'border-[color-mix(in_oklab,var(--wrong)_40%,var(--border))]',
            ].join(' ')}
          >
            <span className={['flex-shrink-0 mt-0.5', a.ok ? 'text-[var(--correct)]' : 'text-[var(--wrong)]'].join(' ')} aria-hidden="true">
              {a.ok ? <CheckIcon /> : <XIcon />}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-body text-[0.95rem] text-[var(--text)] leading-snug mb-2">{a.texto}</p>
              <div className="font-body text-sm flex flex-col gap-1">
                {!a.ok && (
                  <p className="text-[var(--wrong)] line-through opacity-70">
                    <span className="not-line-through font-mono uppercase tracking-wider mr-1.5 opacity-70">Tu respuesta</span>
                    {a.opciones[a.selected]}
                  </p>
                )}
                <p className="text-[var(--correct)] font-medium">
                  <span className="font-mono uppercase tracking-wider mr-1.5 opacity-70">Correcta</span>
                  {a.opciones[a.correct]}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
<div className="flex gap-3 justify-center flex-wrap">
        <button
          onClick={onRestart}
          className="bg-[var(--gold)] text-[#0B0911] font-body font-semibold text-sm px-7 py-3.5 rounded-full transition-all duration-200 hover:bg-[var(--gold-2)] hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(255,216,77,0.4)] focus-visible:outline-2 focus-visible:outline-[var(--gold)] focus-visible:outline-offset-4"
        >
          Repetir desafío
        </button>
        <button
          onClick={onHome}
          className="bg-transparent text-[var(--text)] font-body font-medium text-sm px-7 py-3.5 rounded-full border border-[var(--border-2)] transition-all duration-200 hover:border-[var(--gold)] hover:text-[var(--gold)] focus-visible:outline-2 focus-visible:outline-[var(--gold)] focus-visible:outline-offset-4"
        >
          Volver al inicio
        </button>
      </div>
    </section>
  )
}
