// Función serverless de Vercel: analítica de producto de PAICIO.
//
// POST → registra un evento de juego anónimo (inicia_partida / completa_partida)
//        identificado solo por el client_id del navegador (el mismo anónimo que
//        usa el buzón de feedback). SIN datos personales.
// GET  → estadísticas agregadas (privado: requiere la clave del buzón): jugadores
//        únicos, partidas iniciadas/completadas y desglose por episodio.
//
// Usa la service_role key de Supabase (solo en el servidor, nunca en el
// navegador). Variables de entorno en Vercel (las mismas del buzón):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, BUZON_PASSWORD
import { createClient } from '@supabase/supabase-js'

// Eventos permitidos (lista blanca — nada libre desde el cliente).
const EVENTOS = new Set(['inicia_partida', 'completa_partida'])
const RESULTADOS = new Set(['perfect', 'partial', 'wrong'])

function getClient() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

function checkPass(req) {
  const pass = req.headers['x-buzon-pass'] || req.query?.pass || ''
  return process.env.BUZON_PASSWORD && pass === process.env.BUZON_PASSWORD
}

export default async function handler(req, res) {
  const supabase = getClient()
  if (!supabase) return res.status(500).json({ error: 'Analítica no configurada.' })

  // ── Registrar un evento (público, anónimo) ───────────────────────────────
  if (req.method === 'POST') {
    try {
      const { evento, episodio, resultado, estrellas, clientId, url } = req.body || {}
      if (!EVENTOS.has(evento)) {
        return res.status(400).json({ error: 'Evento no válido.' })
      }
      const estrellasNum = Number.isFinite(Number(estrellas))
        ? Math.max(0, Math.min(3, Math.round(Number(estrellas))))
        : null
      const { error } = await supabase.from('eventos').insert({
        evento,
        episodio: episodio ? String(episodio).slice(0, 40) : null,
        resultado: RESULTADOS.has(resultado) ? resultado : null,
        estrellas: estrellasNum,
        client_id: clientId ? String(clientId).slice(0, 80) : null,
        url: url ? String(url).slice(0, 400) : null,
      })
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json({ ok: true })
    } catch (e) {
      return res.status(500).json({ error: e.message })
    }
  }

  // ── Estadísticas agregadas (privado) ─────────────────────────────────────
  if (req.method === 'GET') {
    if (!checkPass(req)) return res.status(401).json({ error: 'Clave incorrecta.' })
    const { data, error } = await supabase.rpc('stats_eventos')
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data ?? {})
  }

  return res.status(405).json({ error: 'Método no permitido.' })
}
