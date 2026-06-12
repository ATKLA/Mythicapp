import { useState } from 'react'
import { useEscape } from '../../hooks/useEscape'

const NAV_ITEMS = [
  { id: 'home',       label: 'Inicio' },
  { id: 'library',    label: 'Biblioteca' },
  { id: 'characters', label: 'Personajes' },
  { id: 'quiz',       label: 'Desafío' },
]

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4.5"/>
    <line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/>
    <line x1="4.9" y1="4.9" x2="6.3" y2="6.3"/><line x1="17.7" y1="17.7" x2="19.1" y2="19.1"/>
    <line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/>
    <line x1="4.9" y1="19.1" x2="6.3" y2="17.7"/><line x1="17.7" y1="6.3" x2="19.1" y2="4.9"/>
  </svg>
)
const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)
const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="13" x2="20" y2="13"/><line x1="4" y1="19" x2="14" y2="19"/>
  </svg>
)
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const ChevIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)

export function Navbar({ section, theme, onNavigate, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const isDark = theme === 'dark'

  const go = (id) => { onNavigate(id); setMenuOpen(false) }
  useEscape(() => setMenuOpen(false), menuOpen)

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)] backdrop-blur-xl">
      <div className="max-w-[1180px] mx-auto px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <button
          onClick={() => go('home')}
          aria-label="Mythicapp — Inicio"
          className="flex items-center gap-2.5 opacity-100 hover:opacity-75 transition-opacity duration-200 focus-visible:outline-2 focus-visible:outline-[var(--gold)] focus-visible:outline-offset-4 focus-visible:rounded-lg"
        >
          <img src="/medusa.png" alt="" className="w-9 h-9 object-contain" aria-hidden="true" />
          <span className="font-display text-2xl tracking-widest leading-none select-none">
            <span className="text-[var(--text)]">MYTHIC</span><span className="text-[var(--gold)]">APP</span>
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5" aria-label="Navegación principal">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              aria-current={section === item.id ? 'page' : undefined}
              className={[
                'relative font-body text-[0.95rem] font-medium px-3.5 py-2.5 rounded-lg transition-colors duration-200',
                'focus-visible:outline-2 focus-visible:outline-[var(--gold)] focus-visible:outline-offset-2',
                section === item.id
                  ? 'text-[var(--gold)]'
                  : 'text-[var(--text-2)] hover:text-[var(--text)]',
              ].join(' ')}
            >
              {item.label}
              {section === item.id && (
                <span className="absolute left-1/2 -translate-x-1/2 bottom-0.5 w-1 h-1 rounded-full bg-[var(--gold)]" />
              )}
            </button>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            aria-label={isDark ? 'Activar tema claro' : 'Activar tema oscuro'}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-2)] hover:text-[var(--gold)] hover:border-[var(--border-2)] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[var(--gold)] focus-visible:outline-offset-2"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-2)] hover:text-[var(--gold)] hover:border-[var(--border-2)] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[var(--gold)] focus-visible:outline-offset-2"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Navegación principal"
          className="md:hidden border-t border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_94%,transparent)] backdrop-blur-2xl"
          style={{ animation: 'fadeUp 0.25s var(--ease-out) both' }}
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              aria-current={section === item.id ? 'page' : undefined}
              className={[
                'w-full flex items-center justify-between px-6 py-4 border-b border-[var(--border)] font-body text-[1.05rem] font-medium transition-colors duration-200',
                'focus-visible:outline-2 focus-visible:outline-[var(--gold)] focus-visible:-outline-offset-2',
                section === item.id ? 'text-[var(--gold)]' : 'text-[var(--text-2)] hover:text-[var(--gold)]',
              ].join(' ')}
            >
              {item.label}
              <ChevIcon />
            </button>
          ))}
        </nav>
      )}
    </header>
  )
}
