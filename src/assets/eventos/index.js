// ─────────────────────────────────────────────────────────────────────────
// Íconos de las cartas de evento (shocks). El disco de acento viene HORNEADO
// en la imagen (ver GUIA-ICONOS-EVENTOS.md): se renderizan recortados en
// círculo, sin CSS de disco. Se usa .webp en runtime; los .svg quedan como
// fuente editable y la carpeta transparente/ como variante sin disco.
//
// Clave = nombre de archivo. Los datos del episodio referencian por `iconKey`
// (episode.eventos[].iconKey) porque el id del evento no siempre coincide con
// el del ícono (p. ej. evento 'paro' → ícono 'sindicato').
// ─────────────────────────────────────────────────────────────────────────
import petroleo from './petroleo.webp'
import sindicato from './sindicato.webp'
import fmi from './fmi.webp'
import bancoCorrida from './banco-corrida.webp'
import cosecha from './cosecha.webp'
import acaparamiento from './acaparamiento.webp'
import dolar from './dolar.webp'
import deudaExterna from './deuda-externa.webp'

export const eventIcons = {
  petroleo,
  sindicato,
  fmi,
  'banco-corrida': bancoCorrida,
  cosecha,
  acaparamiento,
  dolar,
  'deuda-externa': deudaExterna,
}
