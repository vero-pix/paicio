import { useCountUp } from '../../lib/animations.js'

export default function GameProgress({ mes, meses, score, accent }) {
  const shown = Math.round(useCountUp(score, 600))

  return (
    <div className="mt-2 flex items-center gap-2 rounded-[14px] bg-panel/70 px-3 py-1.5">
      <span
        key={score}
        className="animate-pop-big flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-round text-[0.74rem] font-bold tabular-nums"
        style={{ background: '#F7E0B0', color: '#9A6B12' }}
      >
        <span aria-hidden>🪙</span>
        {shown.toLocaleString('es-CL')}
      </span>

      <div className="flex flex-1 gap-0.5">
        {Array.from({ length: meses }).map((_, i) => {
          const filled = i < mes
          const current = i === mes - 1
          const hot = i >= meses - 2
          const bg = filled
            ? hot
              ? 'linear-gradient(90deg,#E8604F,#C43D2C)'
              : `linear-gradient(90deg,${accent.face},${accent.edge})`
            : '#E6D6B8'
          return (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full ${current ? 'animate-slow-pulse' : ''}`}
              style={{
                background: bg,
                boxShadow: current ? `0 0 4px ${hot ? '#E8604F' : accent.face}` : 'none',
                transition: 'background 0.4s ease',
              }}
            />
          )
        })}
      </div>

      <span className="shrink-0 font-nunito text-[0.68rem] font-extrabold tabular-nums text-ink-mute">
        {mes}/{meses}
      </span>
    </div>
  )
}
