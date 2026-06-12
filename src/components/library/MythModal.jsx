import { useRef, useMemo, useEffect } from 'react'
import { CIV_COLORS, CIV_SIGILS, CIV_META } from '../../data/civilizations'
import { MYTHS } from '../../data/myths'
import { useEscape } from '../../hooks/useEscape'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'
import { useFocusTrap } from '../../hooks/useFocusTrap'

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

export function MythModal({ myth, onClose, onSelect }) {
  const bgRef  = useRef(null)
  const boxRef = useRef(null)
  const color  = CIV_COLORS[myth.era]
  const meta   = CIV_META[myth.era]

  const related = useMemo(
    () => MYTHS.filter(m => m.era === myth.era && m.titulo !== myth.titulo).slice(0, 3),
    [myth]
  )

  useEscape(onClose)
  useBodyScrollLock()
  useFocusTrap(boxRef)

  // Reset scroll + focus when navigating to a related myth
  useEffect(() => {
    if (bgRef.current) bgRef.current.scrollTop = 0
    boxRef.current?.focus()
  }, [myth])

  return (
    <div
      ref={bgRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 py-[5vh] overflow-y-auto bg-black/80 backdrop-blur-md"
      style={{ animation: 'overlayIn 0.25s var(--ease) both' }}
    >
      <article
        ref={boxRef}
        tabIndex={-1}
        className="relative w-full max-w-[760px] bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.7)] outline-none"
        style={{ animation: 'modalIn 0.4s var(--ease-out) both' }}
      >
        {/* Colour bar */}
        <div className="h-1 rounded-t-2xl" style={{ background: color }} />

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-[var(--card-hi)] border border-[var(--border)] text-[var(--text-2)] hover:text-[var(--gold)] hover:border-[var(--border-2)] hover:rotate-90 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[var(--gold)] focus-visible:outline-offset-2"
        >
          <CloseIcon />
        </button>

        <div className="p-8 max-sm:p-6 pr-16 max-sm:pr-14">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 font-mono text-[0.78rem] tracking-[0.22em] uppercase mb-3" style={{ color }}>
            <span aria-hidden="true">{CIV_SIGILS[myth.era]}</span>
            {meta.fullName} · {meta.epoch}
          </div>

          <h2 id="modal-title" className="font-display text-[clamp(1.8rem,4vw,2.6rem)] tracking-[0.04em] text-[var(--text)] leading-none mb-4">
            {myth.titulo}
          </h2>

          <p className="font-body italic text-[1.05rem] text-[var(--text-2)] leading-relaxed mb-6 pb-6 border-b border-[var(--border)]">
            {myth.resumen}
          </p>

          <p className="font-body text-[1.05rem] text-[var(--text)] leading-[1.8] mb-6">
            {myth.detalle}
          </p>

          <p className="font-body italic text-[0.9rem] text-[var(--text-3)] pt-4 border-t border-[var(--border)]">
            <span className="not-italic font-mono text-[0.75rem] tracking-[0.18em] uppercase text-[var(--text-2)] mr-2">Fuente</span>
            {myth.ref}
          </p>

          {/* Related myths */}
          {related.length > 0 && (
            <div className="mt-8 pt-6 border-t border-[var(--border)]">
              <h3 className="font-mono text-[0.75rem] tracking-[0.22em] uppercase text-[var(--text-3)] mb-4">
                Otros mitos de la {meta.fullName}
              </h3>
              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map(m => (
                  <button
                    key={m.titulo}
                    onClick={() => onSelect(m)}
                    className="text-left p-3.5 border border-[var(--border)] rounded-xl bg-transparent hover:border-[var(--border-2)] hover:bg-[var(--card-hi)] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{ '--outline-color': color }}
                  >
                    <span className="block font-display text-base tracking-wider text-[var(--text)] leading-snug mb-1">{m.titulo}</span>
                    <span className="block font-body italic text-sm text-[var(--text-3)] leading-snug line-clamp-2">{m.resumen}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  )
}
