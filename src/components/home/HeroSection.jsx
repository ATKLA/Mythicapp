import { GoldenDust } from './GoldenDust'
import { MYTHS } from '../../data/myths'
import { QUESTIONS_POOL } from '../../data/questions'

const MYTH_COUNT     = MYTHS.length
const QUESTION_COUNT = QUESTIONS_POOL.length

export function HeroSection({ onNavigate }) {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex-1 flex items-center justify-center overflow-hidden isolate py-8"
    >
      <GoldenDust />

      <div className="relative z-[1] flex flex-col items-center text-center px-6 w-full">

        <div className="relative flex-shrink-0 w-[clamp(200px,30vw,300px)]">
          <div
            aria-hidden="true"
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-[55%] pointer-events-none z-0"
            style={{
              background:   'radial-gradient(ellipse 80% 80% at 50% 60%, rgba(255,216,77,0.22) 0%, transparent 70%)',
              mixBlendMode: 'screen',
            }}
          />
          <img
            src="/medusa.png"
            alt="Medusa — emblema de Mythicapp"
            className="medusa-img relative z-[1] w-full h-auto block animate-[scaleIn_1.1s_var(--ease-out)_both]"
          />
        </div>

        <p
          aria-hidden="true"
          className="font-display text-[clamp(3.8rem,11vw,8rem)] tracking-[0.12em] leading-none -mt-[0.08em] animate-[fadeUp_0.85s_0.12s_var(--ease-out)_both]"
        >
          <span className="text-[var(--text)]">MYTHIC</span>
          <span className="text-[var(--gold)] [text-shadow:0_0_40px_rgba(255,216,77,0.4)]">APP</span>
        </p>

        <h1
          id="hero-title"
          className="font-body text-[clamp(1.15rem,2.4vw,1.4rem)] font-normal leading-[1.55] text-[var(--text-2)] mt-5 max-w-[34ch] animate-[fadeUp_0.85s_0.24s_var(--ease-out)_both]"
        >
          Todo empezó con un mito.<br />
          <em className="not-italic text-[var(--gold)]">¿Eres capaz de recordarlos?</em>
        </h1>

        <p
          aria-hidden="true"
          className="font-mono text-[0.8rem] tracking-[0.18em] uppercase text-[var(--text-3)] mt-2.5 animate-[fadeUp_0.85s_0.33s_var(--ease-out)_both]"
        >
          {QUESTION_COUNT} preguntas · {MYTH_COUNT} mitos · 4 civilizaciones
        </p>

        <div className="mt-8 animate-[fadeUp_0.85s_0.42s_var(--ease-out)_both]">
          <button
            onClick={() => onNavigate('quiz')}
            className="font-body font-semibold text-base px-8 py-3.5 min-h-[48px] bg-[var(--gold)] text-[#0B0911] border-none rounded-full cursor-pointer transition-all duration-200 hover:bg-[var(--gold-2)] hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(255,216,77,0.45)] focus-visible:outline-2 focus-visible:outline-[var(--gold)] focus-visible:outline-offset-4"
          >
            Aceptar el desafío
          </button>
        </div>

      </div>
    </section>
  )
}
