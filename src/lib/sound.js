// ─────────────────────────────────────────────────────────────────────────
// Motor de sonido de PAICIO.
//
// - SFX cortos: sintetizados con Web Audio API (sin archivos, sin descargas).
// - Música por episodio: intenta cargar /audio/music/<id>.mp3 con Howler; si
//   no existe el archivo, cae a un ambiente procedural (drone) por episodio.
// - Mute y volumen global persistidos en localStorage (paicio.sound).
// - Pausa la música si la pestaña pierde el foco.
//
// Toda la API es "fire-and-forget": nunca toca el estado del juego.
// ─────────────────────────────────────────────────────────────────────────
import { Howl } from 'howler'

const LS_KEY = 'paicio.sound'
const MUSIC_VOL = 0.4 // volumen de la música (no tapa el texto)
const SFX_VOL = 0.55 // volumen base de los efectos

// ── Estado persistido ──────────────────────────────────────────────────────
function loadPrefs() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return { muted: false, volume: 0.7, ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return { muted: false, volume: 0.7 }
}
let prefs = loadPrefs()
function savePrefs() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(prefs))
  } catch {
    /* ignore */
  }
}

// ── AudioContext perezoso (se crea/reanuda tras un gesto del usuario) ────────
let ctx = null
function ensureCtx() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}
// Desbloquea el audio en el primer gesto (política de autoplay del navegador).
if (typeof window !== 'undefined') {
  const unlock = () => {
    ensureCtx()
    window.removeEventListener('pointerdown', unlock)
    window.removeEventListener('keydown', unlock)
  }
  window.addEventListener('pointerdown', unlock)
  window.addEventListener('keydown', unlock)
}

// ── Utilidades de síntesis ───────────────────────────────────────────────────
function master() {
  return prefs.muted ? 0 : prefs.volume
}

// Volumen efectivo de la música: base por episodio escalada por el volumen global.
function musicVol() {
  return MUSIC_VOL * prefs.volume
}

function tone(freq, { type = 'sine', dur = 0.15, gain = 0.2, attack = 0.005, glideTo = null } = {}) {
  const c = ensureCtx()
  if (!c) return
  const now = c.currentTime
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, now)
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, now + dur)
  const peak = gain * SFX_VOL * master()
  g.gain.setValueAtTime(0.0001, now)
  g.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak), now + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur)
  osc.connect(g).connect(c.destination)
  osc.start(now)
  osc.stop(now + dur + 0.02)
}

function noiseBurst({ dur = 0.05, gain = 0.3, type = 'bandpass', freq = 1800, q = 1 } = {}) {
  const c = ensureCtx()
  if (!c) return
  const now = c.currentTime
  const frames = Math.floor(c.sampleRate * dur)
  const buffer = c.createBuffer(1, frames, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1
  const src = c.createBufferSource()
  src.buffer = buffer
  const filter = c.createBiquadFilter()
  filter.type = type
  filter.frequency.value = freq
  filter.Q.value = q
  const g = c.createGain()
  const peak = gain * SFX_VOL * master()
  g.gain.setValueAtTime(Math.max(0.0001, peak), now)
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur)
  src.connect(filter).connect(g).connect(c.destination)
  src.start(now)
  src.stop(now + dur + 0.02)
}

// ── SFX ──────────────────────────────────────────────────────────────────────
const SFX = {
  // Click de máquina de escribir: golpe seco + tick agudo.
  click() {
    noiseBurst({ dur: 0.03, gain: 0.35, freq: 2400, q: 0.8 })
    tone(180, { type: 'square', dur: 0.04, gain: 0.12 })
  },
  // Fracaso / crisis: golpe grave (thud) + acorde disonante que cae. Se siente mal.
  alert() {
    // Sub-golpe que baja: el "piso que se hunde".
    tone(90, { type: 'sine', dur: 0.45, gain: 0.32, attack: 0.004, glideTo: 44 })
    // Impacto sordo.
    noiseBurst({ dur: 0.18, gain: 0.22, type: 'lowpass', freq: 380, q: 0.7 })
    // Disonancia grave: dos tonos casi juntos (baten) que caen.
    tone(220, { type: 'sawtooth', dur: 0.55, gain: 0.16, attack: 0.02, glideTo: 175 })
    tone(233, { type: 'sawtooth', dur: 0.55, gain: 0.14, attack: 0.02, glideTo: 185 })
  },
  // Éxito / avance: arpegio mayor ascendente + brillo de campana. Se siente bien.
  advance() {
    // Do–Mi–Sol–Do ascendente.
    ;[523, 659, 784, 1046].forEach((f, i) =>
      setTimeout(() => tone(f, { type: 'triangle', dur: 0.22, gain: 0.16 }), i * 70),
    )
    // Campana brillante al llegar arriba.
    setTimeout(() => {
      tone(1568, { type: 'sine', dur: 0.5, gain: 0.1 })
      tone(2093, { type: 'sine', dur: 0.5, gain: 0.055 })
    }, 220)
  },
  // Periódico / impacto: golpe grave + barrido de "papel".
  newspaper() {
    tone(140, { type: 'sine', dur: 0.28, gain: 0.28, glideTo: 60 })
    noiseBurst({ dur: 0.22, gain: 0.18, type: 'lowpass', freq: 1200, q: 0.5 })
  },
  // Moneda / recompensa: dos campanitas brillantes ascendentes. Sabor a premio.
  coin() {
    tone(1318, { type: 'triangle', dur: 0.12, gain: 0.14 })
    setTimeout(() => tone(1760, { type: 'triangle', dur: 0.18, gain: 0.12 }), 70)
    setTimeout(() => tone(2637, { type: 'sine', dur: 0.22, gain: 0.06 }), 120)
  },
  // Fanfarria corta: arpegio mayor triunfal + campana. Para la reforma exitosa.
  fanfare() {
    ;[523, 659, 784, 1046, 1319].forEach((f, i) =>
      setTimeout(() => tone(f, { type: 'triangle', dur: 0.3, gain: 0.16 }), i * 90),
    )
    setTimeout(() => {
      tone(1568, { type: 'sine', dur: 0.7, gain: 0.12 })
      tone(2093, { type: 'sine', dur: 0.7, gain: 0.07 })
    }, 450)
  },
}

export function sfx(name) {
  if (prefs.muted) return
  try {
    SFX[name]?.()
  } catch {
    /* audio no disponible */
  }
}

// Motivo musical del desenlace según el resultado ('perfect' | 'partial' | 'wrong').
// Triunfal si salvaste al país; sombrío si colapsó.
export function sting(tier) {
  if (prefs.muted) return
  const c = ensureCtx()
  if (!c) return
  const now = c.currentTime
  const note = (freq, start, dur, gain = 0.14, type = 'triangle') => {
    const osc = c.createOscillator()
    const g = c.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, now + start)
    const peak = gain * master()
    g.gain.setValueAtTime(0.0001, now + start)
    g.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak), now + start + 0.05)
    g.gain.exponentialRampToValueAtTime(0.0001, now + start + dur)
    osc.connect(g).connect(c.destination)
    osc.start(now + start)
    osc.stop(now + start + dur + 0.05)
  }
  try {
    if (tier === 'perfect') {
      // Triada mayor ascendente, cálida (do–mi–sol–do).
      ;[[523, 0], [659, 0.14], [784, 0.28], [1046, 0.44]].forEach(([f, t]) =>
        note(f, t, 1.0, 0.14, 'triangle'),
      )
    } else if (tier === 'wrong') {
      // Acorde menor grave y sostenido + bajo que cae (sombrío).
      ;[220, 262, 330].forEach((f) => note(f, 0, 1.6, 0.1, 'sawtooth'))
      note(147, 0.6, 1.4, 0.12, 'sine')
      note(110, 1.0, 1.4, 0.12, 'sine')
    } else {
      // Cadencia neutra, sin resolución clara.
      note(392, 0, 0.8, 0.12, 'triangle')
      note(523, 0.16, 0.9, 0.1, 'triangle')
    }
  } catch {
    /* audio no disponible */
  }
}

// ── Música ────────────────────────────────────────────────────────────────────
// Ambiente procedural por episodio (fallback si no hay archivo). `root` en Hz,
// `cutoff` del filtro, `q` de la resonancia — definen el "humor" de cada crisis.
const MOODS = {
  ep1: { root: 110.0, cutoff: 520, q: 4 }, // Weimar — tenso, grave
  ep2: { root: 98.0, cutoff: 460, q: 6 }, // Argentina — ansioso
  ep3: { root: 130.8, cutoff: 600, q: 3 }, // Chile — frío
  ep4: { root: 87.3, cutoff: 420, q: 5 }, // Brasil crónico — pesado
  ep5: { root: 146.8, cutoff: 700, q: 3 }, // Plan Real — algo de esperanza
  menu: { root: 116.5, cutoff: 560, q: 3 },
}

let currentId = null
let currentHowl = null
let ambient = null // { nodes[], gain, lfo }

// Desvanece y detiene un ambiente concreto (para poder cruzar dos a la vez).
function fadeOutAmbient(a, fade = 0.8) {
  if (!a) return
  const c = ensureCtx()
  try {
    if (c) {
      const now = c.currentTime
      a.gain.gain.cancelScheduledValues(now)
      a.gain.gain.setValueAtTime(Math.max(0.0001, a.gain.gain.value), now)
      a.gain.gain.exponentialRampToValueAtTime(0.0001, now + fade)
    }
    setTimeout(() => a.nodes.forEach((n) => { try { n.stop() } catch { /* */ } }), fade * 1000 + 60)
  } catch {
    /* */
  }
}

function stopAmbient(fade = 0.8) {
  if (!ambient) return
  const a = ambient
  ambient = null
  fadeOutAmbient(a, fade)
}

// Desvanece y descarga un Howl concreto (saliente de un crossfade).
function fadeOutHowl(h, fade = 1200) {
  if (!h) return
  try {
    h.fade(h.volume(), 0, fade)
    setTimeout(() => { try { h.unload() } catch { /* */ } }, fade + 120)
  } catch {
    /* */
  }
}

function startAmbient(id) {
  const c = ensureCtx()
  if (!c) return
  const mood = MOODS[id] || MOODS.menu
  const now = c.currentTime
  const gain = c.createGain()
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(prefs.muted ? 0.0001 : musicVol(), now + 2.5)

  const filter = c.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = mood.cutoff
  filter.Q.value = mood.q

  // LFO lento sobre el corte del filtro: da "respiración" al drone.
  const lfo = c.createOscillator()
  const lfoGain = c.createGain()
  lfo.frequency.value = 0.06
  lfoGain.gain.value = mood.cutoff * 0.35
  lfo.connect(lfoGain).connect(filter.frequency)

  // Osciladores: raíz, quinta y sub-octava, apenas desafinados.
  const freqs = [mood.root, mood.root * 1.5, mood.root / 2]
  const nodes = [lfo]
  freqs.forEach((f, i) => {
    const osc = c.createOscillator()
    osc.type = i === 2 ? 'sine' : 'sawtooth'
    osc.frequency.value = f
    osc.detune.value = (i - 1) * 6
    const og = c.createGain()
    og.gain.value = i === 2 ? 0.5 : 0.28
    osc.connect(og).connect(filter)
    nodes.push(osc)
  })
  filter.connect(gain).connect(c.destination)
  nodes.forEach((n) => { try { n.start(now) } catch { /* */ } })

  ambient = { nodes, gain, lfo }
}

// Cambia de pista con crossfade: la nueva entra mientras la anterior sale, sin
// corte brusco. `opts.fallbackToAmbient` (default true): si no existe el archivo,
// usa el drone procedural. Si es false y el archivo falta, se MANTIENE lo que
// suena (no corta) — pensado para pistas opcionales como 'decision'.
export function playMusic(id, { fallbackToAmbient = true, fade = 1400 } = {}) {
  if (id === currentId) return
  const prevId = currentId
  currentId = id

  // Adoptamos lo que sonaba como "saliente"; se cruza al confirmar la entrada.
  const prevHowl = currentHowl
  const prevAmbient = ambient
  currentHowl = null
  ambient = null

  const crossOut = () => {
    fadeOutHowl(prevHowl, fade)
    fadeOutAmbient(prevAmbient, fade / 1000)
  }
  // Restaura lo anterior cuando la pista nueva no llega (archivo ausente).
  const keepPrevious = () => {
    currentId = prevId
    currentHowl = prevHowl
    ambient = prevAmbient
  }

  try {
    const howl = new Howl({
      src: [`/audio/music/${id}.mp3`],
      loop: true,
      html5: false,
      volume: 0,
      mute: prefs.muted,
    })
    currentHowl = howl
    howl.once('load', () => {
      if (currentId !== id || currentHowl !== howl) {
        howl.unload()
        return
      }
      howl.play()
      howl.fade(0, musicVol(), fade) // entra
      crossOut() // sale lo anterior en paralelo
    })
    howl.once('loaderror', () => {
      if (currentHowl === howl) currentHowl = null
      if (currentId !== id) return
      if (fallbackToAmbient) {
        startAmbient(id) // drone procedural (entra con su propio fade)
        crossOut()
      } else {
        keepPrevious() // pista opcional ausente: seguimos con lo que sonaba
      }
    })
  } catch {
    if (fallbackToAmbient) {
      startAmbient(id)
      crossOut()
    } else {
      keepPrevious()
    }
  }
}

export function stopMusic() {
  currentId = null
  if (currentHowl) {
    const h = currentHowl
    currentHowl = null
    try {
      h.fade(h.volume(), 0, 800)
      setTimeout(() => h.unload(), 900)
    } catch {
      /* */
    }
  }
  stopAmbient()
}

// ── Mute / volumen ────────────────────────────────────────────────────────────
function applyVolumeToMusic() {
  const c = ctx
  if (currentHowl) currentHowl.volume(prefs.muted ? 0 : musicVol())
  if (ambient && c) {
    const now = c.currentTime
    ambient.gain.gain.cancelScheduledValues(now)
    ambient.gain.gain.setValueAtTime(Math.max(0.0001, ambient.gain.gain.value), now)
    ambient.gain.gain.exponentialRampToValueAtTime(
      prefs.muted ? 0.0001 : musicVol(),
      now + 0.4,
    )
  }
}

export function isMuted() {
  return prefs.muted
}
export function setMuted(v) {
  prefs.muted = !!v
  savePrefs()
  applyVolumeToMusic()
}
export function toggleMuted() {
  setMuted(!prefs.muted)
  return prefs.muted
}
export function getVolume() {
  return prefs.volume
}
export function setVolume(v) {
  prefs.volume = Math.max(0, Math.min(1, v))
  savePrefs()
  applyVolumeToMusic()
}

// ── Pausa al perder el foco de la pestaña ─────────────────────────────────────
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    const hidden = document.hidden
    if (currentHowl) {
      if (hidden) currentHowl.pause()
      else if (!prefs.muted) currentHowl.play()
    }
    if (ambient && ctx) {
      const now = ctx.currentTime
      ambient.gain.gain.cancelScheduledValues(now)
      ambient.gain.gain.setValueAtTime(Math.max(0.0001, ambient.gain.gain.value), now)
      ambient.gain.gain.exponentialRampToValueAtTime(
        hidden || prefs.muted ? 0.0001 : musicVol(),
        now + 0.5,
      )
    }
  })
}
