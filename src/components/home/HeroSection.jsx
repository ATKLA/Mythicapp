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

        {/*
          Medusa image wrapper.
          The glow sits on a separate <div> BEHIND the image, sized to the
          top 55% only (face + hair). This way the glow never touches the
          bottom fade zone, eliminating the yellow smear entirely.
          No drop-shadow filter on the <img> — that was spreading yellow
          through every semi-transparent pixel in the bottom fade.
        */}
        <div
          style={{
            position:   'relative',
            width:      'clamp(200px, 30vw, 300px)',
            flexShrink: 0,
          }}
        >
          {/* Glow only behind the face — top 55% of the image area */}
          <div
            aria-hidden="true"
            style={{
              position:     'absolute',
              top:          0,
              left:         '50%',
              transform:    'translateX(-50%)',
              width:        '90%',
              height:       '55%',
              background:   'radial-gradient(ellipse 80% 80% at 50% 60%, rgba(255,216,77,0.22) 0%, transparent 70%)',
              mixBlendMode: 'screen',
              pointerEvents:'none',
              zIndex:       0,
            }}
          />

          <img
            src="/medusa.png"
            alt="Medusa — emblema de Mythicapp"
            className="medusa-img"
            style={{
              position:   'relative',
              zIndex:     1,
              width:      '100%',
              height:     'auto',
              display:    'block',
              animation:  'scaleIn 1.1s var(--ease-out) both',
            }}
          />
        </div>

        {/* Wordmark */}
        <p
          aria-hidden="true"
          style={{
            fontFamily:    'var(--font-display)',
            fontSize:      'clamp(3.8rem, 11vw, 8rem)',
            letterSpacing: '0.12em',
            lineHeight:    1,
            marginTop:     '-0.08em',
            animation:     'fadeUp 0.85s 0.12s var(--ease-out) both',
          }}
        >
          <span style={{ color: 'var(--text)' }}>MYTHIC</span>
          <span style={{ color: 'var(--gold)', textShadow: '0 0 40px rgba(255,216,77,0.4)' }}>APP</span>
        </p>

        {/* Slogan */}
        <h1
          id="hero-title"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize:   'clamp(1.15rem, 2.4vw, 1.4rem)',
            fontWeight: 400,
            lineHeight: 1.55,
            color:      'var(--text-2)',
            marginTop:  '1.25rem',
            maxWidth:   '34ch',
            animation:  'fadeUp 0.85s 0.24s var(--ease-out) both',
          }}
        >
          Todo empezó con un mito.<br />
          <em style={{ fontStyle: 'normal', color: 'var(--gold)' }}>¿Eres capaz de recordarlos?</em>
        </h1>

        {/* Stats */}
        <p
          aria-hidden="true"
          style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      '0.8rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color:         'var(--text-3)',
            marginTop:     '0.6rem',
            animation:     'fadeUp 0.85s 0.33s var(--ease-out) both',
          }}
        >
          {QUESTION_COUNT} preguntas · {MYTH_COUNT} mitos · 4 civilizaciones
        </p>

        {/* CTA */}
        <div style={{ marginTop: '2rem', animation: 'fadeUp 0.85s 0.42s var(--ease-out) both' }}>
          <button
            onClick={() => onNavigate('quiz')}
            style={{
              fontFamily:   'var(--font-body)',
              fontSize:     '1rem',
              fontWeight:   600,
              padding:      '0.875rem 2rem',
              minHeight:    '48px',
              background:   'var(--gold)',
              color:        '#0B0911',
              border:       'none',
              borderRadius: '999px',
              cursor:       'pointer',
              transition:   'all 0.2s var(--ease)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--gold-2)'
              e.currentTarget.style.transform  = 'translateY(-2px)'
              e.currentTarget.style.boxShadow  = '0 0 32px rgba(255,216,77,0.45)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--gold)'
              e.currentTarget.style.transform  = ''
              e.currentTarget.style.boxShadow  = ''
            }}
            onFocus={e => {
              e.currentTarget.style.outline       = '2px solid var(--gold)'
              e.currentTarget.style.outlineOffset = '4px'
            }}
            onBlur={e => { e.currentTarget.style.outline = 'none' }}
          >
            Aceptar el desafío
          </button>
        </div>
      </div>
    </section>
  )
}
