import { useEffect, useRef } from 'react'

export function useEscape(handler, active = true) {
  const ref = useRef(handler)
  useEffect(() => { ref.current = handler })
  useEffect(() => {
    if (!active) return
    const h = (e) => { if (e.key === 'Escape') ref.current() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [active])
}
