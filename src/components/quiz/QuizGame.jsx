import { useState, useMemo } from 'react'
import { CIV_COLORS, CIV_SIGILS, CIV_META } from '../../data/civilizations'
import { QUESTIONS_POOL } from '../../data/questions'

const LETTERS = ['A', 'B', 'C', 'D']

function shuffle(arr) {
  const b = [...arr]
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]]
  }
  return b
}

export function QuizGame({ config, onComplete, onQuit }) {
  const questions = useMemo(() => {
    const pool = QUESTIONS_POOL.filter(q => config.civs.includes(q.era))
    return shuffle(pool).slice(0, config.length)
  }, [config])

  const [index,    setIndex]    = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [score,    setScore]    = useState(0)
  const [answers,  setAnswers]  = useState([])

  const q        = questions[index]
  const color    = CIV_COLORS[q.era]
  const progress = ((index + (answered ? 1 : 0)) / questions.length) * 100
  const isLast   = index === questions.length - 1

  function pick(i) {
    if (answered) return
    const ok = i === q.correcta
    setSelected(i)
    setAnswered(true)
    if (ok) setScore(s => s + 1)
    setAnswers(p => [...p, {
      texto:    q.texto,
      era:      q.era,
      opciones: q.opciones,
      selected: i,
      correct:  q.correcta,
      ok,
    }])
  }

  function next() {
    if (isLast) {
      
      
      const finalAnswers = [...answers]
      const finalScore = finalAnswers.filter(a => a.ok).length
      onComplete({ score: finalScore, total: questions.length, answers: finalAnswers })
      return
    }
    setIndex(i => i + 1)
    setSelected(null)
    setAnswered(false)
  }

  return (
    <section
      aria-label="Desafío en curso"
      className="flex-1 flex items-start justify-center px-6 py-12"
    >
      <div
        className="w-full max-w-[700px] bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 max-sm:p-6"
        style={{ '--cc': color }}
      >
<div className="flex items-center gap-4 mb-6">
          <div
            className="flex-1 h-[3px] bg-[var(--border)] rounded-full overflow-hidden"
            role="progressbar"
            aria-label="Progreso del desafío"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{ width: `${progress}%`, background: color, boxShadow: `0 0 8px ${color}` }}
            />
          </div>
          <span className="font-mono text-sm tracking-wider text-[var(--text-2)] tabular-nums whitespace-nowrap" aria-live="polite">
            <strong className="text-[var(--gold)] text-base font-semibold mr-1">{score}</strong>
            / {questions.length}
          </span>
        </div>
<div className="flex items-center justify-between mb-1">
          <span className="font-mono text-sm tracking-[0.1em] uppercase text-[var(--text-3)]">
            Pregunta {index + 1} de {questions.length}
          </span>
        </div>
        <span
          className="inline-flex items-center gap-2 font-mono text-sm tracking-[0.1em] uppercase px-3 py-1.5 rounded-full border mb-5"
          style={{ color, borderColor: color, background: `color-mix(in oklab, ${color} 8%, transparent)` }}
        >
          <span aria-hidden="true">{CIV_SIGILS[q.era]}</span>
          {CIV_META[q.era].fullName}
        </span>
<p className="font-body text-[clamp(1.1rem,2.5vw,1.35rem)] font-medium text-[var(--text)] leading-snug mb-7">
          {q.texto}
        </p>
<div className="flex flex-col gap-3 mb-7" role="group" aria-label="Opciones de respuesta">
          {q.opciones.map((opt, i) => {
            const isCorrect  = answered && i === q.correcta
            const isWrong    = answered && i === selected && i !== q.correcta

            return (
              <button
                key={opt}
                onClick={() => pick(i)}
                disabled={answered}
                className={[
                  'flex items-center gap-3.5 text-left px-4 py-3.5 rounded-xl border font-body text-[0.95rem] leading-snug transition-all duration-200',
                  'focus-visible:outline-2 focus-visible:outline-offset-2',
                  'disabled:cursor-default',
                  !answered && 'hover:border-[var(--border-2)] hover:bg-[var(--card-hi)] hover:translate-x-0.5',
                  isCorrect ? 'opt-correct' : '',
                  isWrong   ? 'opt-wrong'   : '',
                  !isCorrect && !isWrong ? 'bg-[var(--card-hi)] border-[var(--border)] text-[var(--text)]' : '',
                  isCorrect ? 'text-[var(--text)]' : '',
                  isWrong   ? 'text-[var(--text)]' : '',
                  isCorrect ? 'animate-[pulseOk_0.5s_var(--ease)_both]'  : '',
                  isWrong   ? 'animate-[shake_0.4s_var(--ease)]'         : '',
                ].filter(Boolean).join(' ')}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center font-mono text-[0.78rem] font-medium flex-shrink-0 border border-[var(--border)] bg-[var(--card)] text-[var(--text-3)] transition-all duration-200"
                  style={isCorrect ? { background: 'var(--correct)', borderColor: 'var(--correct)', color: 'var(--ink)' }
                        : isWrong  ? { background: 'var(--wrong)',   borderColor: 'var(--wrong)',   color: 'var(--ink)' }
                        : undefined}
                  aria-hidden="true"
                >
                  {LETTERS[i]}
                </span>
                <span className="flex-1">{opt}</span>
                {isCorrect && <span className="text-[var(--correct)] flex-shrink-0"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></span>}
                {isWrong   && <span className="text-[var(--wrong)] flex-shrink-0"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span>}
              </button>
            )
          })}
        </div>
{answered && (
          <div
            className="font-body text-sm text-[var(--text-2)] italic px-4 py-3.5 rounded-xl mb-6 leading-relaxed border-l-[3px]"
            style={{ background: 'var(--card-hi)', borderColor: color, animation: 'fadeUp 0.4s var(--ease-out) both' }}
            role="status"
          >
            <strong className="not-italic font-mono text-sm tracking-[0.1em] uppercase mr-2 font-semibold" style={{ color }}>
              {selected === q.correcta ? 'Acierto' : 'Fallo'}
            </strong>
            {q.pista}
          </div>
        )}
<div className="flex items-center justify-between gap-3 flex-wrap">
          <button
            onClick={onQuit}
            className="font-mono text-[0.78rem] tracking-[0.14em] uppercase text-[var(--text-3)] hover:text-[var(--wrong)] transition-colors duration-200 py-2 focus-visible:outline-2 focus-visible:outline-[var(--gold)] focus-visible:outline-offset-2 focus-visible:rounded-lg"
          >
            Abandonar
          </button>
          <button
            onClick={next}
            disabled={!answered}
            className="bg-[var(--gold)] text-[#0B0911] font-body font-semibold text-sm px-6 py-3 rounded-full transition-all duration-200 hover:bg-[var(--gold-2)] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-[var(--gold)] focus-visible:outline-offset-4 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isLast ? 'Ver resultados' : 'Siguiente'}
          </button>
        </div>
      </div>
    </section>
  )
}
