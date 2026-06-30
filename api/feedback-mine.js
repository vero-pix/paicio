// Función serverless: comentarios propios de un tester (por client_id).
// GET /api/feedback-mine?clientId=... → devuelve sus comentarios + respuestas.
// Público pero filtrado por client_id (un UUID impredecible del navegador), así
// cada tester solo ve lo suyo sin exponer el resto del buzón.
import { createClient } from '@supabase/supabase-js'

function getClient() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

export default async function handler(req, res) {
  const supabase = getClient()
  if (!supabase) return res.status(500).json({ error: 'Buzón no configurado.' })
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido.' })

  const clientId = req.query?.clientId || ''
  if (!clientId) return res.status(400).json({ error: 'Falta clientId.' })

  const { data, error } = await supabase
    .from('feedback')
    .select('id, created_at, comment, stage, reply, replied_at')
    .eq('client_id', String(clientId).slice(0, 80))
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ items: data ?? [] })
}
