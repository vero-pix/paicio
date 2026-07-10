// ─────────────────────────────────────────────────────────────────────────
// Íconos de las cartas de evento (shocks). El disco de acento viene HORNEADO
// en la imagen (ver GUIA-ICONOS-EVENTOS.md): se renderizan recortados en
// círculo, sin CSS de disco. Se usa .webp en runtime; los .svg quedan como
// fuente editable y la carpeta transparente/ como variante sin disco.
//
// Clave = nombre de archivo. Los datos del episodio referencian por `iconKey`;
// si un evento no trae `iconKey`, EventCard usa su `id` como clave (Claude
// Design nombró los íconos de Ep2–Ep4 según el id del evento). Si tampoco hay
// ícono para esa clave, EventCard cae al emoji.
// ─────────────────────────────────────────────────────────────────────────

// Bolivia (Ep1) — set original.
import petroleo from './petroleo.webp'
import sindicato from './sindicato.webp'
import fmi from './fmi.webp'
import bancoCorrida from './banco-corrida.webp'
import cosecha from './cosecha.webp'
import acaparamiento from './acaparamiento.webp'
import dolar from './dolar.webp'
import deudaExterna from './deuda-externa.webp'

// Ep2 — El Corralito (Argentina 2001).
import riesgoPais from './riesgoPais.webp'
import cacerolazo from './cacerolazo.webp'
import patacones from './patacones.webp'
import fugaCapitales from './fugaCapitales.webp'
import rumorPeso from './rumorPeso.webp'
import exportaciones from './exportaciones.webp'
import feriado from './feriado.webp'

// Ep3 — Defender la paridad (Chile 1982).
import fed from './fed.webp'
import cobre from './cobre.webp'
import quiebraBanco from './quiebraBanco.webp'
import fugaDolares from './fugaDolares.webp'
import rumorDeval from './rumorDeval.webp'
import exportaPunta from './exportaPunta.webp'
import paroCobre from './paroCobre.webp'

// Ep4 — La Inercia (Brasil).
import filtracion from './filtracion.webp'
import sindicatos from './sindicatos.webp'
import dolarParalelo from './dolarParalelo.webp'
import remarcaje from './remarcaje.webp'
import senalFiscal from './senalFiscal.webp'
import reboteCongelamiento from './reboteCongelamiento.webp'
import fmiGesto from './fmiGesto.webp'

// Lote Mercado — Ep6 México (Tequila).
import colosio from './colosio.webp'
import tesobonos from './tesobonos.webp'
import rescateFMI from './rescateFMI.webp'
// Lote Mercado — Ep13 Chile / cobre.
import china from './china.webp'
import sustituto from './sustituto.webp'
// Lote Mercado — Ep14 Pensiones.
import retiroAnticipado from './retiroAnticipado.webp'
import crisisMercado from './crisisMercado.webp'
import envejecimiento from './envejecimiento.webp'
// Línea Microeconomía — emblema (balanza).
import microeconomia from './microeconomia.webp'

export const eventIcons = {
  // Ep1
  petroleo,
  sindicato,
  fmi,
  'banco-corrida': bancoCorrida,
  cosecha,
  acaparamiento,
  dolar,
  'deuda-externa': deudaExterna,
  // Ep2
  riesgoPais,
  cacerolazo,
  patacones,
  fugaCapitales,
  rumorPeso,
  exportaciones,
  feriado,
  // Ep3
  fed,
  cobre,
  quiebraBanco,
  fugaDolares,
  rumorDeval,
  exportaPunta,
  paroCobre,
  // Ep4
  filtracion,
  sindicatos,
  dolarParalelo,
  remarcaje,
  senalFiscal,
  reboteCongelamiento,
  fmiGesto,
  // Lote Mercado — Ep6 / Ep13 / Ep14 (fed y fmi ya existen → se reusan)
  colosio,
  tesobonos,
  rescateFMI,
  china,
  sustituto,
  retiroAnticipado,
  crisisMercado,
  envejecimiento,
  // Línea Microeconomía
  microeconomia,
}
