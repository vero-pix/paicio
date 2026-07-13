import { useState, useEffect, useCallback } from 'react'

// ─────────────────────────────────────────────────────────────────────────
// FeedbackButton — botón flotante de cocreación para testers.
// El tester comenta y, en "Mis comentarios", ve su comentario + la respuesta
// de Vero. Identidad anónima por navegador (client_id en localStorage).
// Guarda en Supabase vía las funciones /api/feedback y /api/feedback-mine.
// ─────────────────────────────────────────────────────────────────────────

// Deriva un "stage" legible del estado de juego guardado (para saber dónde
// estaba el tester al comentar), sin acoplar este componente al juego.
function leerStage() {
  try {
    const raw = localStorage.getItem('paicio.state.v2')
    if (!raw) return 'menú'
    const s = JSON.parse(raw)
    if (!s?.episodeId) return 'menú'
    return `${s.episodeId} · ${s.phase ?? ''}`.trim()
  } catch {
    return ''
  }
}

export default function FeedbackButton() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('write') // 'write' | 'mine'
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [ok, setOk] = useState(false)
  const [clientId, setClientId] = useState('')
  const [mine, setMine] = useState([])

  // Identidad anónima persistente por navegador.
  useEffect(() => {
    let id = localStorage.getItem('paicio_client_id')
    if (!id) {
      id =
        (crypto.randomUUID && crypto.randomUUID()) ||
        `c_${Math.random().toString(36).slice(2)}${Date.now()}`
      localStorage.setItem('paicio_client_id', id)
    }
    setClientId(id)
  }, [])

  const loadMine = useCallback(async (id) => {
    if (!id) return
    try {
      const res = await fetch(`/api/feedback-mine?clientId=${encodeURIComponent(id)}`)
      const data = await res.json()
      if (res.ok) setMine(data.items || [])
    } catch {
      /* sin conexión: se reintenta al abrir */
    }
  }, [])

  useEffect(() => {
    if (clientId) loadMine(clientId)
  }, [clientId, loadMine])

  const hasReply = mine.some((m) => m.reply)

  const send = async () => {
    if (!comment.trim() || sending) return
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || null,
          comment: comment.trim(),
          stage: leerStage(),
          url: typeof window !== 'undefined' ? window.location.href : '',
          clientId,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'No se pudo enviar')
      setComment('')
      setOk(true)
      await loadMine(clientId)
      setTab('mine')
    } catch (e) {
      setError(e.message)
    } finally {
      setSending(false)
    }
  }

  const fmt = (iso) => {
    try {
      return new Date(iso).toLocaleString('es-CL', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return ''
    }
  }

  return (
    <>
      {/* Botón flotante */}
      <button
        type="button"
        onClick={() => {
          setOpen(true)
          setOk(false)
          loadMine(clientId)
        }}
        aria-label="Comentar al desarrollador"
        className="shadow-card fixed z-40 flex h-11 w-11 items-center justify-center rounded-full bg-surface text-ink-warm transition-all hover:-translate-y-px"
        style={{
          bottom: 'calc(env(safe-area-inset-bottom) + 1rem)',
          right: 'calc(env(safe-area-inset-right) + 1rem)',
        }}
      >
        <span aria-hidden className="text-lg">💬</span>
        {hasReply && (
          <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#2FB37E]" />
        )}
      </button>

      {/* Modal */}
      {open && (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-end justify-center bg-[#2A1C0C]/60 backdrop-blur-sm sm:items-center">
          <div className="shadow-panel max-h-[88%] w-full max-w-md overflow-y-auto rounded-t-[24px] bg-panel p-5 pb-7 sm:rounded-[24px]">
            <div className="relative z-10">
              {/* Header + tabs */}
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setTab('write')}
                    className={`font-round text-[1.15rem] font-bold leading-tight transition-colors ${tab === 'write' ? 'text-ink-warm' : 'text-ink-mute'}`}
                  >
                    Comentar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTab('mine')
                      loadMine(clientId)
                    }}
                    className={`font-round text-[1.15rem] font-bold leading-tight transition-colors ${tab === 'mine' ? 'text-ink-warm' : 'text-ink-mute'}`}
                  >
                    Mis comentarios{mine.length ? ` (${mine.length})` : ''}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-mute hover:bg-cream hover:text-ink-warm"
                >
                  ✕
                </button>
              </div>

              {tab === 'write' ? (
                <div className="mt-3 space-y-3">
                  <p className="font-nunito text-[0.84rem] leading-snug text-ink-soft">
                    Tu comentario ayuda a mejorar PAICIO. Te respondo acá mismo, en
                    "Mis comentarios".
                  </p>
                  <input
                    placeholder="Tu nombre (opcional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11 w-full rounded-[12px] border border-[#E8CE9A] bg-surface px-4 font-nunito text-sm text-ink-warm outline-none placeholder:text-ink-mute/70 focus:border-ink-mute"
                  />
                  <textarea
                    autoFocus
                    placeholder="¿Qué no se entiende? ¿Qué mejorarías? ¿Qué te gustó?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="h-28 w-full resize-none rounded-[12px] border border-[#E8CE9A] bg-surface p-4 font-nunito text-[0.95rem] text-ink-warm outline-none placeholder:text-ink-mute/70 focus:border-ink-mute"
                  />
                  {error && <p className="font-nunito text-[0.72rem] font-bold text-[#D24C39]">{error}</p>}
                  <button
                    type="button"
                    onClick={send}
                    disabled={!comment.trim() || sending}
                    className="candy w-full px-5 py-3 text-[0.95rem] disabled:opacity-40"
                    style={{ '--face': 'var(--color-gold)', '--edge': 'var(--color-gold-edge)' }}
                  >
                    {sending ? 'Enviando…' : 'Enviar comentario →'}
                  </button>
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  {mine.length === 0 ? (
                    <p className="py-6 text-center font-nunito text-sm text-ink-soft">
                      Aún no comentaste. Tus comentarios y mis respuestas aparecerán acá.
                    </p>
                  ) : (
                    mine.map((m) => (
                      <div key={m.id} className="space-y-2">
                        <div className="shadow-card rounded-[16px] bg-surface p-3">
                          <div className="mb-1.5 flex items-center justify-between">
                            <span className="font-nunito text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-ink-mute">
                              Tú{m.stage ? ` · ${m.stage}` : ''}
                            </span>
                            <span className="font-nunito text-[0.68rem] font-bold text-ink-mute/70">
                              {fmt(m.created_at)}
                            </span>
                          </div>
                          <p className="font-nunito text-[0.92rem] leading-relaxed text-ink-warm">
                            {m.comment}
                          </p>
                        </div>
                        {m.reply ? (
                          <div className="ml-4 rounded-[16px] border-l-2 border-[#2FB37E] bg-[#D6F0E5] p-3">
                            <span className="font-nunito text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-[#1F9A6E]">
                              Respuesta de Vero
                            </span>
                            <p className="mt-1 font-nunito text-[0.92rem] leading-relaxed text-ink-warm">
                              {m.reply}
                            </p>
                          </div>
                        ) : (
                          <p className="ml-4 font-nunito text-[0.6rem] font-extrabold uppercase tracking-[0.14em] text-ink-mute/80">
                            Esperando respuesta…
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
