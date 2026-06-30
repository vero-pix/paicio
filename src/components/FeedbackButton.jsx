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
        className="fixed bottom-4 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-edge bg-cell text-paper shadow-lg shadow-black/50 transition-all hover:border-paper-dim hover:-translate-y-px"
      >
        <span aria-hidden className="text-lg">💬</span>
        {hasReply && (
          <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-ink bg-positive" />
        )}
      </button>

      {/* Modal */}
      {open && (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-end justify-center bg-ink/70 backdrop-blur-sm sm:items-center">
          <div className="grain max-h-[88%] w-full max-w-md overflow-y-auto rounded-t-2xl border-t border-edge bg-cell p-5 pb-7 shadow-2xl sm:rounded-2xl sm:border">
            <div className="relative z-10">
              {/* Header + tabs */}
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setTab('write')}
                    className={`font-display text-xl leading-tight transition-colors ${tab === 'write' ? 'text-paper' : 'text-paper-dim/60'}`}
                  >
                    Comentar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTab('mine')
                      loadMine(clientId)
                    }}
                    className={`font-display text-xl leading-tight transition-colors ${tab === 'mine' ? 'text-paper' : 'text-paper-dim/60'}`}
                  >
                    Mis comentarios{mine.length ? ` (${mine.length})` : ''}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-paper-dim hover:bg-ink/40 hover:text-paper"
                >
                  ✕
                </button>
              </div>

              {tab === 'write' ? (
                <div className="mt-3 space-y-3">
                  <p className="font-body text-[0.84rem] leading-snug text-paper-dim">
                    Tu comentario ayuda a mejorar PAICIO. Te respondo acá mismo, en
                    "Mis comentarios".
                  </p>
                  <input
                    placeholder="Tu nombre (opcional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11 w-full rounded-md border border-edge bg-ink/40 px-4 font-body text-sm text-paper outline-none placeholder:text-paper-dim/50 focus:border-paper-dim"
                  />
                  <textarea
                    autoFocus
                    placeholder="¿Qué no se entiende? ¿Qué mejorarías? ¿Qué te gustó?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="h-28 w-full resize-none rounded-md border border-edge bg-ink/40 p-4 font-body text-[0.95rem] text-paper outline-none placeholder:text-paper-dim/50 focus:border-paper-dim"
                  />
                  {error && <p className="font-mono text-[0.72rem] text-crisis">{error}</p>}
                  <button
                    type="button"
                    onClick={send}
                    disabled={!comment.trim() || sending}
                    className="w-full rounded-sm border border-crisis bg-crisis/15 py-3 font-display font-semibold tracking-wide text-paper transition-all hover:bg-crisis/25 active:scale-[0.99] disabled:opacity-40"
                  >
                    {sending ? 'Enviando…' : 'Enviar comentario →'}
                  </button>
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  {mine.length === 0 ? (
                    <p className="py-6 text-center font-body text-sm text-paper-dim">
                      Aún no comentaste. Tus comentarios y mis respuestas aparecerán acá.
                    </p>
                  ) : (
                    mine.map((m) => (
                      <div key={m.id} className="space-y-2">
                        <div className="rounded-md border border-edge bg-ink/30 p-3">
                          <div className="mb-1.5 flex items-center justify-between">
                            <span className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-paper-dim">
                              Tú{m.stage ? ` · ${m.stage}` : ''}
                            </span>
                            <span className="font-mono text-[0.55rem] text-paper-dim/70">
                              {fmt(m.created_at)}
                            </span>
                          </div>
                          <p className="font-body text-[0.92rem] leading-relaxed text-paper">
                            {m.comment}
                          </p>
                        </div>
                        {m.reply ? (
                          <div className="ml-4 rounded-md border-l-2 border-positive bg-positive/10 p-3">
                            <span className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-positive">
                              Respuesta de Vero
                            </span>
                            <p className="mt-1 font-body text-[0.92rem] leading-relaxed text-paper">
                              {m.reply}
                            </p>
                          </div>
                        ) : (
                          <p className="ml-4 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-paper-dim/70">
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
