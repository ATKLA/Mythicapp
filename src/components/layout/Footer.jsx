export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-5 px-6 mt-auto">
      <p className="max-w-[1180px] mx-auto font-mono text-[0.78rem] tracking-[0.1em] text-[var(--text-3)] text-center">
        © {new Date().getFullYear()} Mythicapp · Creado por{' '}
        <a
          href="https://github.com/ATKLA"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--gold)] hover:underline focus-visible:outline-2 focus-visible:outline-[var(--gold)] focus-visible:outline-offset-2 focus-visible:rounded-sm"
        >
          ATKLA
        </a>
      </p>
    </footer>
  )
}
