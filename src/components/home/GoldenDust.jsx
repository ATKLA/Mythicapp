import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export function GoldenDust() {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || reduced) return
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let raf, W = 0, H = 0, particles = []

    const make = () => ({
      x:     Math.random() * (W || 800),
      y:     Math.random() * (H || 600),  // initial spawn spread across full height
      r:     Math.random() * 1.2 + 0.3,
      vy:    Math.random() * 0.22 + 0.05,
      vx:    (Math.random() - 0.5) * 0.12,
      // Each particle has its own opacity cycle driven by y position only
      // No life counter that resets mid-screen — eliminates flash on respawn
    })

    const resize = () => {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      canvas.width  = W * dpr
      canvas.height = H * dpr
      ctx.scale(dpr, dpr)
      particles = Array.from({ length: 90 }, make)
    }

    resize()
    window.addEventListener('resize', resize)

    const tick = () => {
      ctx.clearRect(0, 0, W, H)

      for (const p of particles) {
        p.y += p.vy
        p.x += p.vx

        // Wrap horizontally
        if (p.x < 0) p.x = W
        if (p.x > W) p.x = 0

        // When particle exits bottom, respawn at TOP with x=0 alpha
        // so there is never a sudden pop at a random position
        if (p.y > H) {
          p.x  = Math.random() * W
          p.y  = 0
          p.vy = Math.random() * 0.22 + 0.05
          p.vx = (Math.random() - 0.5) * 0.12
          p.r  = Math.random() * 0.9 + 0.2
        }

        // Alpha driven purely by y position:
        // Fade in over top 8% → full opacity 8–75% → fade out bottom 25%
        // This is continuous and smooth — no discrete life cycle, no flash
        const yRatio = p.y / H
        const alpha =
          yRatio < 0.08 ? (yRatio / 0.08) * 0.55
          : yRatio < 0.75 ? 0.55
          : (1 - (yRatio - 0.75) / 0.25) * 0.55

        if (alpha < 0.01) continue

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,220,100,${alpha.toFixed(3)})`
        ctx.fill()
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [reduced])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  )
}
