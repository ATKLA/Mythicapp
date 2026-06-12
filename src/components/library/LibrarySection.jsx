import { useMemo } from 'react'
import { MYTHS } from '../../data/myths'
import { Toolbar } from '../ui/Toolbar'
import { MythCard } from './MythCard'

const EmptyState = () => (
  <div className="col-span-full text-center py-20 text-[var(--text-3)]">
    <p className="font-display text-4xl tracking-widest opacity-20 mb-4">✦</p>
    <p className="font-display text-lg tracking-wider text-[var(--text-2)] mb-2">El oráculo guarda silencio</p>
    <p className="font-body text-sm">Ningún mito coincide. Cambia el filtro o prueba otra búsqueda.</p>
  </div>
)

export function LibrarySection({ filter, search, onFilter, onSearch, onOpenMyth }) {
  const filtered = useMemo(() => {
    let r = filter === 'todas' ? MYTHS : MYTHS.filter(m => m.era === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      r = r.filter(m => ['titulo','resumen','detalle','ref'].some(k => (m[k] || '').toLowerCase().includes(q)))
    }
    return r
  }, [filter, search])

  return (
    <section
      id="biblioteca"
      aria-labelledby="library-title"
      className="flex-1 max-w-[1180px] w-full mx-auto px-6 py-16 scroll-mt-20"
    >
      <div className="flex items-end justify-between gap-8 flex-wrap mb-10">
        <div className="flex flex-col gap-1.5 max-w-[60ch]">
          <span className="font-mono text-[0.78rem] tracking-[0.28em] uppercase text-[var(--gold)] opacity-85">— Biblioteca</span>
          <h2 id="library-title" className="font-display text-[clamp(1.8rem,4vw,2.8rem)] tracking-wider text-[var(--text)] leading-none">
            {MYTHS.length} RELATOS <span className="text-[var(--gold)]">DE LA MEMORIA</span>
          </h2>
          <p className="font-body text-base text-[var(--text-2)] leading-relaxed mt-1">
            Crónicas, juicios, traiciones y catástrofes. Cada mito incluye su fuente original.
          </p>
        </div>
        <p className="font-mono text-[0.85rem] tracking-[0.14em] uppercase text-[var(--text-3)] pb-1" role="status">
          {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
        </p>
      </div>

      <Toolbar
        filter={filter}
        search={search}
        onFilter={onFilter}
        onSearch={onSearch}
        placeholder="Buscar mito, dios, fuente..."
        searchLabel="Buscar en la biblioteca de mitos"
      />

      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
        {filtered.length === 0
          ? <EmptyState />
          : filtered.map((m, i) => (
              <MythCard
                key={m.titulo}
                myth={m}
                onClick={onOpenMyth}
                delay={Math.min(i * 30, 240)}
              />
            ))
        }
      </div>
    </section>
  )
}
