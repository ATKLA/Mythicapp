import { useEffect } from 'react'

const FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])'

export function useFocusTrap(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const prev = document.activeElement
    el.focus()
    const onKey = (e) => {
      if (e.key !== 'Tab') return
      const nodes = [...el.querySelectorAll(FOCUSABLE)].filter(n => n.offsetParent !== null)
      if (!nodes.length) return
      const first = nodes[0], last = nodes[nodes.length - 1]
      if (e.shiftKey && (document.activeElement === first || document.activeElement === el)) {
        e.preventDefault(); last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey); prev?.focus?.() }
  }, [ref])
}
