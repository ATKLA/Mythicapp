import { useState, useEffect } from 'react'
import { useReducedMotion } from './useReducedMotion'

export function useCounter(target, duration = 900) {
  const [value, setValue] = useState(0)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced) { setValue(target); return }
    const start = performance.now()
    let raf
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, reduced])
  return value
}
