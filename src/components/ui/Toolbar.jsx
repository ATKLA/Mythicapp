import { CIVILIZATIONS, CIV_COLORS } from '../../data/civilizations'

export function Toolbar({ filter, search, onFilter, onSearch, placeholder, searchLabel }) {
  return (
    <div className="flex gap-3 items-center mb-7 flex-wrap">
<div className="flex gap-1.5 flex-wrap flex-1 min-w-0" role="group" aria-label="Filtrar por civilización">
        {CIVILIZATIONS.map((c) => {
          const active = filter === c.id
          const color = c.id !== 'todas' ? CIV_COLORS[c.id] : undefined
          return (
            <button
              key={c.id}
              onClick={() => onFilter(c.id)}
              aria-pressed={active}
              style={color ? { '--tc': color } : undefined}
              className={[
                'font-mono text-[0.75rem] tracking-[0.14em] uppercase px-3.5 py-1.5 rounded-full border transition-all duration-200 min-h-[34px]',
                active
                  ? 'bg-[var(--gold-dim)] border-[var(--tc,var(--border-2))] text-[var(--tc,var(--gold))]'
                  : 'bg-transparent border-[var(--border)] text-[var(--text-3)] hover:text-[var(--text)] hover:border-[var(--border-2)]',
                'focus-visible:outline-2 focus-visible:outline-[var(--tc,var(--gold))] focus-visible:outline-offset-2',
              ].join(' ')}
            >
              {c.label}
            </button>
          )
        })}
      </div>
<div className="relative flex-[0_0_240px] min-w-[200px] max-sm:flex-[1_1_100%]">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)] pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7"/><line x1="20" y1="20" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
          aria-label={searchLabel}
          className="w-full bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--text)] font-body text-sm pl-9 pr-3 py-2 min-h-[40px] transition-all duration-200 placeholder:text-[var(--text-3)] focus:outline-none focus:border-[var(--gold)] focus:bg-[var(--card-hi)]"
        />
      </div>
    </div>
  )
}
