// ─────────────────────────────────────────────────────────────────────────
// Analítica de producto de PAICIO — cliente.
//
// Registra eventos de juego anónimos (inicia_partida / completa_partida) contra
// /api/evento, identificados SOLO por el client_id anónimo del navegador (el
// mismo que usa el buzón de feedback, llave localStorage 'paicio_client_id').
// Sin datos personales.
//
// Es "fire-and-forget": si la red falla o el backend no está, NO rompe ni traba
// el juego (todo va en try/catch y nunca se await desde la UI).
// ─────────────────────────────────────────────────────────────────────────

// Mismo client_id anónimo que FeedbackButton (misma llave, misma generación).
export function getClientId() {
  try {
    let id = localStorage.getItem('paicio_client_id')
    if (!id) {
      id =
        (crypto.randomUUID && crypto.randomUUID()) ||
        `c_${Math.random().toString(36).slice(2)}${Date.now()}`
      localStorage.setItem('paicio_client_id', id)
    }
    return id
  } catch {
    return null
  }
}

// track('inicia_partida', { episodio }) | track('completa_partida', { episodio, resultado, estrellas })
export function track(evento, payload = {}) {
  try {
    // No medir la vista privada del buzón (admin), solo el juego.
    if (typeof window !== 'undefined' && window.location.hash.toLowerCase() === '#buzon') return

    const body = JSON.stringify({
      evento,
      episodio: payload.episodio ?? null,
      resultado: payload.resultado ?? null,
      estrellas: payload.estrellas ?? null,
      clientId: getClientId(),
      url: typeof window !== 'undefined' ? window.location.href.slice(0, 400) : null,
    })

    // sendBeacon sobrevive a la navegación (ideal para completa_partida); fetch
    // con keepalive como respaldo. Ninguno bloquea la UI.
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon('/api/evento', new Blob([body], { type: 'application/json' }))
    } else {
      fetch('/api/evento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {})
    }
  } catch {
    // Nunca romper el juego por analítica.
  }
}
