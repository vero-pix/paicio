// Retratos de los personajes. Mapeados por id de prisionero para usarlos en
// toda la interfaz. Los episodios 2-5 usan los grabados vintage; el Episodio 1
// (Bolivia) estrena retratos ilustrados nuevos (estilo mascota, con disco de
// color de fondo que el marco-moneda dorado recorta en círculo).

// ── Episodio 1 (Bolivia) ────────────────────────────────────────────────
import marcos from './don-marcos.png'
import rosa from './gladys.png'
import fondo from './senor-fondo.png'
import comerciante from './comerciante.png'
import presidente from './el-presidente.png'

// ── Episodio 2 ──────────────────────────────────────────────────────────
import banquero2 from './banquero-ep2.webp'
import vecina from './vecina-ep2.webp'
import acreedor from './acreedor-ep2.webp'
import gobernador from './gobernador-ep2.webp'

// ── Episodio 3 ──────────────────────────────────────────────────────────
import tecnocrata from './tecnocrata-ep3.webp'
import banqueroDeuda from './banquero-deuda-ep3.webp'
import trabajadorChile from './trabajador-ep3.webp'
import fmiChile from './fmi-ep3.webp'

// ── Episodio 4 ──────────────────────────────────────────────────────────
import ministro from './ministro-ep4.webp'
import indexador from './indexador-ep4.webp'
import empresario from './empresario-ep4.webp'
import congreso from './congreso-ep4.webp'

// ── Episodio 5 ──────────────────────────────────────────────────────────
import economistaJoven from './economista-ep5.webp'
import presidenteReal from './presidente-ep5.webp'
import puebloReal from './pueblo-ep5.webp'
import mercadoReal from './mercado-ep5.webp'

export const portraits = {
  // Ep1
  marcos, rosa, fondo, comerciante, presidente,
  // Ep2
  banquero2, vecina, acreedor, gobernador,
  // Ep3
  tecnocrata, banqueroDeuda, trabajadorChile, fmiChile,
  // Ep4
  ministro, indexador, empresario, congreso,
  // Ep5
  economistaJoven, presidenteReal, puebloReal, mercadoReal,
  // Ep6 — México (retratos pendientes: reusa ep3/ep4 como placeholder)
  tesobono: banqueroDeuda,
  comerciante_mex: empresario,
  politico_mex: congreso,
  fmi_mex: fmiChile,
  // Ep7 — Perú (retratos pendientes: reusa ep3/ep4 como placeholder)
  tecnico_peru: tecnocrata,
  social_peru: empresario,
  empresario_peru: banqueroDeuda,
  militar_peru: congreso,
  // Ep9 — Ford (retratos pendientes)
  ford: presidenteReal,
  ingeniero: tecnocrata,
  obrero: trabajadorChile,
  proveedor: banqueroDeuda,
  // Ep10 — Marx
  marx: presidenteReal,
  // Ep11 — Keynes
  keynes: tecnocrata,
  // Ep12 — Friedman
  friedman: banqueroDeuda,
  // Ep13 — Cobre
  precioCobre: trabajadorChile,
  // Ep14 — Pensiones
  diseniador: tecnocrata,
}
