import { useMemo } from 'react'
import { CHARACTERS } from '../../data/characters'
import { Toolbar } from '../ui/Toolbar'
import { CharCard } from './CharCard'

const EmptyState = () => (
  <div className="col-span-full text-center py-20 text-[var(--text-3)]">
    <p className="font-display text-4xl tracking-widest opacity-20 mb-4">✦</p>
    <p className="font-display text-lg tracking-wider text-[var(--text-2)] mb-2">Sin figuras</p>
    <p className="font-body text-sm">Prueba con otro nombre o cambia el filtro.</p>
  </div>
)

export function CharactersSection({ filter, search, onFilter, onSearch }) {
  const filtered = useMemo(() => {
    let r = filter === 'todas' ? CHARACTERS : CHARACTERS.filter(c => c.era === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      r = r.filter(c => ['nombre','rol','detalle'].some(k => (c[k] || '').toLowerCase().includes(q)))
    }
    return r
  }, [filter, search])

  return (
    <section
      id="personajes"
      aria-labelledby="chars-title"
      className="flex-1 max-w-[1180px] w-full mx-auto px-6 py-16 scroll-mt-20"
    >
      <div className="flex items-end justify-between gap-8 flex-wrap mb-10">
        <div className="flex flex-col gap-1.5 max-w-[60ch]">
          <span className="font-mono text-[0.78rem] tracking-[0.28em] uppercase text-[var(--gold)] opacity-85">— Personajes</span>
          <h2 id="chars-title" className="font-display text-[clamp(1.8rem,4vw,2.8rem)] tracking-wider text-[var(--text)] leading-none">
            {CHARACTERS.length} FIGURAS <span className="text-[var(--gold)]">LEGENDARIAS</span>
          </h2>
          <p className="font-body text-base text-[var(--text-2)] leading-relaxed mt-1">
            Dioses, héroes, monstruos y mortales que dieron forma a la mitología antigua.
          </p>
        </div>
        <p className="font-mono text-[0.85rem] tracking-[0.14em] uppercase text-[var(--text-3)] pb-1" role="status">
          {filtered.length} {filtered.length === 1 ? 'figura' : 'figuras'}
        </p>
      </div>

      <Toolbar
        filter={filter}
        search={search}
        onFilter={onFilter}
        onSearch={onSearch}
        placeholder="Buscar nombre, rol..."
        searchLabel="Buscar entre los personajes"
      />

      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
        {filtered.length === 0
          ? <EmptyState />
          : filtered.map((c, i) => (
              <CharCard key={c.nombre} char={c} delay={Math.min(i * 30, 240)} />
            ))
        }
      </div>
    </section>
  )
}
