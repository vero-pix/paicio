// Función serverless de Vercel: buzón de feedback de PAICIO.
//
// POST   → un tester guarda un comentario (incluye client_id del navegador).
// GET    → lista todos los comentarios (privado: requiere la clave del buzón).
// PATCH  → Vero responde un comentario (privado: requiere la clave).
// DELETE → borra un comentario (privado: requiere la clave).
//
// Usa la service_role key de Supabase (solo en el servidor, nunca en el
// navegador) que bypassa RLS. Variables de entorno en Vercel:
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, BUZON_PASSWORD
import { createClient } from '@supabase/supabase-js'

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
  if (!supabase) return res.status(500).json({ error: 'Buzón no configurado.' })

  // ── Guardar un comentario (público) ─────────────────────────────────────
  if (req.method === 'POST') {
    try {
      const { name, comment, stage, url, clientId } = req.body || {}
      if (!comment || !String(comment).trim()) {
        return res.status(400).json({ error: 'El comentario está vacío.' })
      }
      const { error } = await supabase.from('feedback').insert({
        name: name ? String(name).slice(0, 120) : null,
        comment: String(comment).slice(0, 4000),
        stage: stage ? String(stage).slice(0, 80) : null,
        url: url ? String(url).slice(0, 400) : null,
        client_id: clientId ? String(clientId).slice(0, 80) : null,
      })
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json({ ok: true })
    } catch (e) {
      return res.status(500).json({ error: e.message })
    }
  }

  // ── Listar todos (privado) ───────────────────────────────────────────────
  if (req.method === 'GET') {
    if (!checkPass(req)) return res.status(401).json({ error: 'Clave incorrecta.' })
    const { data, error } = await supabase
      .from('feedback')
      .select('id, created_at, name, comment, stage, url, reply, replied_at')
      .order('created_at', { ascending: false })
      .limit(300)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ items: data ?? [] })
  }

  // ── Responder (privado) ──────────────────────────────────────────────────
  if (req.method === 'PATCH') {
    try {
      const { id, reply, pass } = req.body || {}
      if (!process.env.BUZON_PASSWORD || pass !== process.env.BUZON_PASSWORD) {
        return res.status(401).json({ error: 'Clave incorrecta.' })
      }
      if (!id) return res.status(400).json({ error: 'Falta el id.' })
      const { error } = await supabase
        .from('feedback')
        .update({
          reply: reply ? String(reply).slice(0, 4000) : null,
          replied_at: reply ? new Date().toISOString() : null,
        })
        .eq('id', id)
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json({ ok: true })
    } catch (e) {
      return res.status(500).json({ error: e.message })
    }
  }

  // ── Borrar (privado) ─────────────────────────────────────────────────────
  if (req.method === 'DELETE') {
    if (!checkPass(req)) return res.status(401).json({ error: 'Clave incorrecta.' })
    const id = req.query?.id || ''
    if (!id) return res.status(400).json({ error: 'Falta el id.' })
    const { error } = await supabase.from('feedback').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ ok: true })
  }

  return res.status(405).json({ error: 'Método no permitido.' })
}
