import { useState, useCallback } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { Navbar }             from './components/layout/Navbar'
import { Footer }             from './components/layout/Footer'
import { HeroSection }        from './components/home/HeroSection'
import { LibrarySection }     from './components/library/LibrarySection'
import { MythModal }          from './components/library/MythModal'
import { CharactersSection }  from './components/characters/CharactersSection'
import { QuizSetup }          from './components/quiz/QuizSetup'
import { QuizGame }           from './components/quiz/QuizGame'
import { ResultsView }        from './components/quiz/ResultsView'

export default function App() {
  // ── Theme ──────────────────────────────────────────────────────────────
  const [theme, setTheme] = useLocalStorage('mythicapp_theme', 'dark')
  const toggleTheme = useCallback(() => {
    setTheme(t => {
      const next = t === 'dark' ? 'light' : 'dark'
      document.documentElement.setAttribute('data-theme', next)
      return next
    })
  }, [setTheme])

  // Apply stored theme on first paint
  useState(() => { document.documentElement.setAttribute('data-theme', theme) })

  // ── Navigation ─────────────────────────────────────────────────────────
  const [section, setSection] = useState('home')
  const [filter,  setFilter]  = useState('todas')
  const [search,  setSearch]  = useState('')

  const navigate = useCallback((s) => {
    setSection(s)
    setFilter('todas')
    setSearch('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (s === 'quiz') { setQuizState('setup'); setQuizResult(null) }
  }, [])

  const selectCiv = useCallback((id) => {
    setFilter(id)
    setSection('library')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // ── Modal ──────────────────────────────────────────────────────────────
  const [openMyth, setOpenMyth] = useState(null)

  // ── Quiz ───────────────────────────────────────────────────────────────
  const [quizState,  setQuizState]  = useState('setup')   // setup | game | results
  const [quizConfig, setQuizConfig] = useState(null)
  const [quizResult, setQuizResult] = useState(null)

  return (
    <>
      <a href="#main" className="skip-link">Saltar al contenido</a>

      <Navbar
        section={section}
        theme={theme}
        onNavigate={navigate}
        onToggleTheme={toggleTheme}
      />

      <main id="main" className="flex flex-col flex-1">

        {section === 'home' && (
          <HeroSection onNavigate={navigate} onSelectCiv={selectCiv} />
        )}

        {section === 'library' && (
          <LibrarySection
            filter={filter}
            search={search}
            onFilter={setFilter}
            onSearch={setSearch}
            onOpenMyth={setOpenMyth}
          />
        )}

        {section === 'characters' && (
          <CharactersSection
            filter={filter}
            search={search}
            onFilter={setFilter}
            onSearch={setSearch}
          />
        )}

        {section === 'quiz' && quizState === 'setup' && (
          <QuizSetup
            onStart={(cfg) => { setQuizConfig(cfg); setQuizState('game') }}
          />
        )}

        {section === 'quiz' && quizState === 'game' && quizConfig && (
          <QuizGame
            config={quizConfig}
            onComplete={(r) => { setQuizResult(r); setQuizState('results') }}
            onQuit={() => setQuizState('setup')}
          />
        )}

        {section === 'quiz' && quizState === 'results' && quizResult && (
          <ResultsView
            result={quizResult}
            onRestart={() => { setQuizState('setup'); setQuizResult(null) }}
            onHome={() => navigate('home')}
          />
        )}

      </main>

      <Footer />

      {openMyth && (
        <MythModal
          myth={openMyth}
          onClose={() => setOpenMyth(null)}
          onSelect={setOpenMyth}
        />
      )}
    </>
  )
}
