import { useState, useCallback } from 'react'

// ─────────────────────────────────────────────────────────────────────────
// Buzon — vista privada de Vero para leer y responder el feedback de testers.
// Se accede en paicio.vercel.app/#buzon. Pide la clave (BUZON_PASSWORD) y
// usa /api/feedback (GET para listar, PATCH para responder).
// ─────────────────────────────────────────────────────────────────────────

export default function Buzon() {
  const [pass, setPass] = useState('')
  const [authed, setAuthed] = useState(false)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [replies, setReplies] = useState({}) // borradores de respuesta por id

  const load = useCallback(async (clave) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/feedback?pass=${encodeURIComponent(clave)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error')
      setItems(data.items || [])
      setAuthed(true)
    } catch (e) {
      setError(e.message)
      setAuthed(false)
    } finally {
      setLoading(false)
    }
  }, [])

  const responder = async (id) => {
    const reply = (replies[id] || '').trim()
    if (!reply) return
    try {
      const res = await fetch('/api/feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, reply, pass }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error')
      setReplies((r) => ({ ...r, [id]: '' }))
      load(pass)
    } catch (e) {
      setError(e.message)
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

  if (!authed) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
        <h1 className="font-display text-3xl font-black text-paper">Buzón de PAICIO</h1>
        <p className="mt-2 font-body text-sm text-paper-dim">
          Vista privada. Ingresa la clave para leer y responder el feedback.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            load(pass)
          }}
          className="mt-5 space-y-3"
        >
          <input
            type="password"
            placeholder="Clave del buzón"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="h-11 w-full rounded-md border border-edge bg-cell px-4 font-body text-paper outline-none placeholder:text-paper-dim/50 focus:border-paper-dim"
          />
          {error && <p className="font-mono text-[0.72rem] text-crisis">{error}</p>}
          <button
            type="submit"
            disabled={loading || !pass}
            className="w-full rounded-sm border border-crisis bg-crisis/15 py-3 font-display font-semibold text-paper transition-all hover:bg-crisis/25 disabled:opacity-40"
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    )
  }

  const sinResponder = items.filter((i) => !i.reply).length

  return (
    <div className="mx-auto max-w-md px-5 py-8">
      <div className="flex items-baseline justify-between">
        <h1 className="font-display text-2xl font-black text-paper">Buzón</h1>
        <span className="font-mono text-[0.62rem] uppercase tracking-wide text-paper-dim">
          {items.length} total · {sinResponder} sin responder
        </span>
      </div>

      <button
        type="button"
        onClick={() => load(pass)}
        className="mt-2 font-mono text-[0.62rem] uppercase tracking-wide text-paper-dim underline-offset-4 hover:text-paper hover:underline"
      >
        ↻ Actualizar
      </button>

      {error && <p className="mt-3 font-mono text-[0.72rem] text-crisis">{error}</p>}

      <div className="mt-5 space-y-4">
        {items.length === 0 && (
          <p className="py-8 text-center font-body text-sm text-paper-dim">
            Todavía no hay comentarios.
          </p>
        )}
        {items.map((m) => (
          <div key={m.id} className="rounded-md border border-edge bg-cell/70 p-4">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-paper-dim">
                {m.name || 'Anónimo'}
                {m.stage ? ` · ${m.stage}` : ''}
              </span>
              <span className="font-mono text-[0.58rem] text-paper-dim/70">
                {fmt(m.created_at)}
              </span>
            </div>
            <p className="font-body text-[0.95rem] leading-relaxed text-paper">{m.comment}</p>

            {m.reply ? (
              <div className="mt-3 rounded-md border-l-2 border-positive bg-positive/10 p-3">
                <span className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-positive">
                  Tu respuesta · {fmt(m.replied_at)}
                </span>
                <p className="mt-1 font-body text-[0.9rem] leading-relaxed text-paper">
                  {m.reply}
                </p>
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                <textarea
                  placeholder="Responder…"
                  value={replies[m.id] || ''}
                  onChange={(e) => setReplies((r) => ({ ...r, [m.id]: e.target.value }))}
                  className="h-20 w-full resize-none rounded-md border border-edge bg-ink/40 p-3 font-body text-[0.9rem] text-paper outline-none placeholder:text-paper-dim/50 focus:border-paper-dim"
                />
                <button
                  type="button"
                  onClick={() => responder(m.id)}
                  disabled={!(replies[m.id] || '').trim()}
                  className="rounded-sm border border-crisis bg-crisis/15 px-4 py-2 font-display text-sm font-semibold text-paper transition-all hover:bg-crisis/25 disabled:opacity-40"
                >
                  Responder →
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
