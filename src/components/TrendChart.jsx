// Gráfico de tendencia educativo para el desenlace.
// Muestra la curva (índice) con ejes numerados, etiquetas de tiempo,
// valores de inicio/fin y —la parte pedagógica— la cifra histórica real.
//
// Lee la serie de `curve` (por política) y la config de `episode.trendChart`.
// Si un episodio aún no define `trendChart`, cae a valores genéricos para no
// romper (los episodios 2-5 se enriquecen después).
export default function TrendChart({ curve, config }) {
  const cfg = config ?? {}
  const titulo = cfg.titulo ?? 'Inflación en Paicio'
  const unidad = cfg.unidad ?? 'índice (pico = 100)'
  const ejeX = cfg.ejeX ?? curve.map((_, i) => `${i}`)

  // Geometría del SVG. Reservamos margen izquierdo para los números del eje Y
  // y margen inferior para las etiquetas de tiempo del eje X.
  const w = 320
  const h = 150
  const padL = 30
  const padR = 10
  const padT = 10
  const padB = 22
  const plotW = w - padL - padR
  const plotH = h - padT - padB

  const max = Math.max(...curve)
  const min = Math.min(...curve, 0)
  const range = max - min || 1

  const x = (i) => padL + (i / (curve.length - 1)) * plotW
  const y = (val) => padT + (1 - (val - min) / range) * plotH

  const pts = curve.map((val, i) => [x(i), y(val)])
  const path = pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`)
    .join(' ')

  // El color refleja el desenlace: si la inflación termina alta (curva no baja
  // lo suficiente), es crisis; si se controla, es positivo.
  const start = curve[0]
  const end = curve[curve.length - 1]
  const controlada = end <= start * 0.6
  const color = controlada ? 'var(--color-positive)' : 'var(--color-crisis)'
  const deltaPct = Math.round(((end - start) / start) * 100)

  // 4 líneas de referencia con su valor numérico.
  const gridVals = [max, min + range * 0.66, min + range * 0.33, min]

  return (
    <div className="rounded-md border border-edge bg-cell-2/60 p-4">
      <div className="mb-2 flex items-baseline justify-between">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-paper-dim">
          {titulo}
        </p>
        <p className="font-mono text-[0.55rem] text-paper-dim/70">{unidad}</p>
      </div>

      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full"
        role="img"
        aria-label={`${titulo}: de ${start} a ${end}`}
      >
        {/* Líneas de referencia + números del eje Y */}
        {gridVals.map((gv, i) => {
          const gy = y(gv)
          return (
            <g key={i}>
              <line
                x1={padL}
                x2={w - padR}
                y1={gy}
                y2={gy}
                stroke="var(--color-edge)"
                strokeWidth="0.5"
                opacity="0.4"
              />
              <text
                x={padL - 4}
                y={gy + 3}
                textAnchor="end"
                fill="var(--color-paper-dim)"
                opacity="0.7"
                style={{ font: "7px var(--font-mono)" }}
              >
                {Math.round(gv)}
              </text>
            </g>
          )
        })}

        {/* Etiquetas de tiempo del eje X */}
        {ejeX.map((lbl, i) => (
          <text
            key={i}
            x={x(i)}
            y={h - 6}
            textAnchor="middle"
            fill="var(--color-paper-dim)"
            opacity="0.7"
            style={{ font: "7px var(--font-mono)" }}
          >
            {lbl}
          </text>
        ))}

        {/* Área bajo la curva (sutil) */}
        <path
          d={`${path} L${pts[pts.length - 1][0].toFixed(1)},${padT + plotH} L${padL},${padT + plotH} Z`}
          fill={color}
          opacity="0.08"
        />

        {/* Línea principal que se "dibuja" */}
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 1000,
            strokeDashoffset: 1000,
            animation: 'draw 2.4s ease-out forwards',
          }}
        />

        {/* Puntos */}
        {pts.map((p, i) => (
          <circle
            key={i}
            cx={p[0]}
            cy={p[1]}
            r={i === 0 || i === pts.length - 1 ? 3.5 : 2.5}
            fill={color}
            opacity={i === 0 || i === pts.length - 1 ? 1 : 0.45}
          />
        ))}
      </svg>
      <style>{`@keyframes draw { to { stroke-dashoffset: 0; } }`}</style>

      {/* Cifras de inicio → fin con la variación */}
      <div className="mt-2 flex items-center justify-between border-t border-edge/50 pt-2 font-mono text-[0.62rem] text-paper-dim">
        <span>
          Inicio <span className="text-paper">{start}</span>
        </span>
        <span style={{ color }}>
          {deltaPct > 0 ? '+' : ''}
          {deltaPct}%
        </span>
        <span>
          Final <span className="text-paper">{end}</span>
        </span>
      </div>

      {/* La lección: cifra histórica real */}
      {cfg.real && (
        <div className="mt-3 rounded-sm border-l-2 border-crisis bg-cell/50 px-3 py-2.5">
          <p className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-crisis">
            En la historia real
          </p>
          {cfg.real.cifra && (
            <p className="mt-1 font-display text-xl font-black leading-none text-paper">
              {cfg.real.cifra}
              {cfg.real.cifraEtiqueta && (
                <span className="ml-2 align-middle font-mono text-[0.55rem] font-normal uppercase tracking-wide text-paper-dim">
                  {cfg.real.cifraEtiqueta}
                </span>
              )}
            </p>
          )}
          <p className="mt-1.5 font-body text-[0.78rem] leading-snug text-paper/85">
            {cfg.real.nota}
          </p>
        </div>
      )}
    </div>
  )
}
