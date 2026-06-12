import { useCounter } from '../../hooks/useCounter'

export function AnimatedNumber({ value, duration = 1100, className }) {
  const n = useCounter(value, duration)
  return <span className={className}>{n}</span>
}
