import { useEffect, useState } from 'react'

export default function AchievementToast({ achievements, onDone }) {
  const [idx, setIdx] = useState(0)
  const [exiting, setExiting] = useState(false)

  const current = achievements[idx]
  useEffect(() => {
    if (!current) { onDone?.(); return }
    const t = setTimeout(() => {
      setExiting(true)
      setTimeout(() => {
        setExiting(false)
        setIdx((i) => i + 1)
      }, 400)
    }, 3000)
    return () => clearTimeout(t)
  }, [idx, current, onDone])

  if (!current) return null

  return (
    <div className="fixed inset-x-0 top-4 z-50 flex justify-center pointer-events-none">
      <div
        className={`shadow-card rounded-[16px] bg-surface px-5 py-3 text-center pointer-events-auto transition-all duration-400 ${
          exiting ? 'animate-fade-out opacity-0 -translate-y-2' : 'animate-fade-in'
        }`}
      >
        <p className="font-nunito text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-amber-600">
          🎉 Logro desbloqueado
        </p>
        <p className="mt-1 font-round text-[1.05rem] font-bold text-ink-warm">
          {current.icon} {current.title}
        </p>
        <p className="font-nunito text-[0.78rem] text-ink-soft">{current.desc}</p>
      </div>
    </div>
  )
}
