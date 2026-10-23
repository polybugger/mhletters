// Letter No. 1, Chapter 1: The Marvels of Simla.
// Built from docs/scripts/letter-001/scene-01.md. The chapter is a dramatized
// prologue, so every line here is from the script, not from the letter.
//
// Sets are locations. Beats are what one scroll or swipe shows: a caption, a
// camera pose (frame units, see core/set.js), and optionally a set state.
import * as THREE from 'three';
import { gsap } from 'gsap';
import { Set } from '../../core/set.js';
import { ambient, bursts, mist } from '../../core/particles.js';

export const textures = [
  'hill-back', 'hill-mid', 'hill-front', 'dig-cup',
  'dig-clump-1', 'dig-clump-2', 'dig-clump-3', 'dig-clump-4', 'dig-clump-5',
  'dig-piece-1', 'dig-piece-2', 'dig-piece-3', 'dig-piece-4', 'dig-piece-5', 'dig-piece-6', 'dig-piece-7', 'dig-piece-8',
  'dig-knife', 'fireside', 'hume-room', 'brooch', 'study', 'doorway',
  'char-sinnett', 'char-blavatsky', 'char-olcott', 'char-hume',
];

// ---------------------------------------------------------------- sets ------

// The title page, the chapter card and the end card: ink, mist and dust.
function inkSet() {
  const s = new Set({ name: 'ink', background: '#101319' });
  const fog = mist({ width: 26, height: 15, z: -2, k: s.k(-2), opacity: 0.22, color: '#2d3b5c' });
  s.scene.add(fog);
  const dust = ambient({ count: 160, box: [-11, 11, -6, 6], z: 0, depth: 4, life: 14, vel: [0.4, 1.2, 0], size: 0.05, color: '#c9d4f2', opacity: 0.45 });
  s.scene.add(dust);
  s.updaters.push((t) => { fog.tick(t); dust.tick(t); });
  return s;
}

// The hillside: mountains, slope and picnic, the three of them, and the grass.
function hillSet(tx) {
  const s = new Set({ name: 'hill', background: '#a9c7dd' });
  s.layer(tx['hill-back'], { z: -11, overscan: 1.3 });
  s.layer(tx['hill-mid'], { z: -4, overscan: 1.16 });
  const z = -1.6;
  s.figure(tx['char-olcott'], { x: -4.5, bottom: -4.95, width: 4.0, z });
  s.figure(tx['char-blavatsky'], { x: -1.5, bottom: -4.5, width: 3.7, z });
  const sinnett = s.figure(tx['char-sinnett'], { x: 5.35, bottom: -4.41, width: 3.4, z, opacity: 0 });
  s.layer(tx['hill-front'], { z: 1.6, overscan: 1.18 });
  const motes = ambient({ count: 90, box: [-9, 9, -3, 5], z: 0.6, depth: 3, life: 12, vel: [0.6, 0.5, 0], size: 0.035, color: '#fff6dc', opacity: 0.5 });
  s.scene.add(motes);
  s.updaters.push((t) => motes.tick(t));
  s.pose = (st, tl, instant) => {
    const o = st.sinnett ?? 1;
    if (instant) sinnett.material.opacity = o;
    else tl.to(sinnett.material, { opacity: o, duration: 1.4, ease: 'power1.out' }, 0.6);
  };
  return s;
}

// The dig: earth piled over a buried cup. The signature move: each beat lifts
// more of the pile, top first, throwing soil, until the china shows.
const PILE = [   // [texture, left%, top%, width%, spin] bottom of the pile first
  ['dig-clump-4', 33, 52, 36, -14], ['dig-clump-2', 45, 38, 33, 12], ['dig-clump-1', 31, 33, 31, -18],
  ['dig-clump-5', 51, 52, 29, 16], ['dig-clump-3', 40, 57, 25, -10], ['dig-piece-1', 29, 42, 30, -24],
  ['dig-piece-2', 53, 33, 28, 22], ['dig-piece-3', 44, 46, 22, -30], ['dig-piece-6', 57, 47, 18, 26],
  ['dig-piece-7', 36, 60, 16, -20], ['dig-piece-4', 46, 30, 20, 18], ['dig-piece-8', 62, 63, 9, 34],
  ['dig-piece-5', 41, 43, 6, -36],
];
const CUP = { x: 0.8, y: -0.45 };

function digSet(tx) {
  const s = new Set({ name: 'dig', background: '#2b2720' });
  s.layer(tx['dig-cup'], { z: 0, overscan: 1.14 });
  const pieces = PILE.map(([name, left, top, width, spin], i) => {
    const t = tx[name], z = 0.05 + i * 0.012, k = s.k(z);
    const w = width / 100 * 16, h = w * t.image.height / t.image.width;
    const x = (left / 100 * 16 + w / 2) - 8, y = 4.5 - (top / 100 * 9 + h / 2);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w * k, h * k), s.material(t));
    m.position.set(x * k, y * k, z);
    m.renderOrder = 100 + i;
    s.scene.add(m);
    return { m, home: m.position.clone(), spin: THREE.MathUtils.degToRad(spin), x, y };
  }).reverse();                                  // removal order: top of the pile first

  const knife = s.figure(tx['dig-knife'], { x: 3.6, bottom: 0.4, width: 4.6, z: 0.8, opacity: 0, breathe: false });
  knife.rotation.z = -0.15;
  const glint = s.glow({ x: CUP.x, y: CUP.y + 0.3, z: 0.6, size: 4.5, color: '#fff3d6', intensity: 0, flicker: 0.08 });
  const soil = bursts({ max: 600, size: 0.09, color: '#3a2a1b', z: 0.9 });
  s.scene.add(soil);
  s.updaters.push((t, dt) => soil.tick(t, dt));

  let scrape = null;
  s.pose = (st, tl, instant) => {
    const n = st.removed ?? 0;
    let delay = 0;
    pieces.forEach((p, r) => {
      const gone = r < n;
      const dir = p.x >= CUP.x ? 1 : -1;
      const target = gone
        ? { x: p.home.x + dir * (2.4 + Math.random()), y: p.home.y + 2.6 + Math.random() * 1.2, rot: p.spin * 3, o: 0 }
        : { x: p.home.x, y: p.home.y, rot: 0, o: 1 };
      const changing = Math.abs(p.m.material.opacity - target.o) > 0.01;
      if (instant || !changing) {
        p.m.position.x = target.x; p.m.position.y = target.y; p.m.rotation.z = target.rot; p.m.material.opacity = target.o;
        return;
      }
      const at = delay; delay += 0.14;
      if (gone) tl.call(() => soil.emit(p.home.x, p.home.y, 26, 1.2), null, at);
      tl.to(p.m.position, { x: target.x, y: target.y, duration: 0.9, ease: gone ? 'power2.out' : 'power2.inOut' }, at);
      tl.to(p.m.rotation, { z: target.rot, duration: 0.9, ease: 'power1.out' }, at);
      tl.to(p.m.material, { opacity: target.o, duration: gone ? 0.75 : 0.5, ease: 'power1.in' }, at + (gone ? 0.15 : 0));
    });

    // the knife: in, scraping, a jolt when it strikes, then away
    scrape?.kill(); scrape = null;
    const mode = st.knife || 'off';
    const on = mode === 'in' || mode === 'scrape' || mode === 'strike';
    if (instant) knife.material.opacity = on ? 1 : 0;
    else tl.to(knife.material, { opacity: on ? 1 : 0, duration: 0.5 }, 0);
    if (mode === 'scrape' && !instant) {
      scrape = gsap.to(knife.position, { x: '+=0.45', y: '-=0.18', duration: 0.22, yoyo: true, repeat: 11, ease: 'sine.inOut' });
    }
    if (mode === 'strike' && !instant) {
      tl.to(knife.position, { y: '-=0.35', duration: 0.08, ease: 'power4.in' }, 0.5)
        .to(knife.position, { y: '+=0.35', duration: 0.5, ease: 'elastic.out(1, 0.35)' }, 0.58)
        .to(s.cam, { shake: 1, duration: 0.05 }, 0.55)
        .to(s.cam, { shake: 0, duration: 0.7, ease: 'power2.out' }, 0.6)
        .call(() => soil.emit(CUP.x, CUP.y + 0.4, 40, 0.8), null, 0.56);
    }
    const g = st.glint ?? 0;
    if (instant) glint.base = g; else tl.to(glint, { base: g, duration: 1.6, ease: 'power2.out' }, 0.3);
  };
  return s;
}

// Dusk by the fire.
function fireSet(tx) {
  const s = new Set({ name: 'fire', background: '#141a2c' });
  s.layer(tx['fireside'], { z: 0, overscan: 1.14 });
  s.figure(tx['char-olcott'], { x: -5.6, bottom: -5.3, width: 3.5, z: 1.2, tint: '#cf9f80' });
  s.figure(tx['char-sinnett'], { x: 5.5, bottom: -4.7, width: 3.2, z: 1.3, tint: '#dba57e' });
  const fire = s.glow({ x: 0.3, y: -1.9, z: 0.5, size: 7, color: '#ff8a32', intensity: 0.75, flicker: 0.32 });
  s.glow({ x: 0.3, y: -2.1, z: 0.6, size: 2.2, color: '#ffd28a', intensity: 0.9, flicker: 0.45 });
  const sparks = ambient({ count: 70, box: [-0.4, 1.0, -2.2, -1.7], z: 0.4, depth: 0.4, life: 2.6, vel: [0.3, 4.2, 0], sway: [0.35, 0.1, 0], size: 0.05, color: '#ffb35c', opacity: 0.95 });
  s.scene.add(sparks);
  s.updaters.push((t) => sparks.tick(t));
  s.fire = fire;
  return s;
}

// The brooch, held up to the lamp.
function broochSet(tx) {
  const s = new Set({ name: 'brooch', background: '#1a1610' });
  s.layer(tx['brooch'], { z: 0, overscan: 1.12 });
  s.glow({ x: 6.6, y: 0.8, z: 0.2, size: 6, color: '#ffbf6a', intensity: 0.55, flicker: 0.12 });
  const sparkle = s.glow({ x: 1.9, y: 2.4, z: 0.3, size: 1.6, color: '#fff4d0', intensity: 0.9, flicker: 0.6 });
  sparkle.sprite.material.rotation = 0.4;
  return s;
}

// Hume's drawing room.
function humeSet(tx) {
  const s = new Set({ name: 'hume', background: '#1d1913' });
  s.layer(tx['hume-room'], { z: 0, overscan: 1.14 });
  const hpb = s.figure(tx['char-blavatsky'], { x: 5.2, bottom: -5.4, width: 2.8, z: 0.6 });
  const hume = s.figure(tx['char-hume'], { x: -5.1, bottom: -5.6, width: 3.9, z: 1.0 });
  const sinnett = s.figure(tx['char-sinnett'], { x: -1.8, bottom: -5.9, width: 3.4, z: 1.1, opacity: 0 });
  [[-3.2, -0.9, 3.4], [2.6, -1.0, 4], [7.4, 0.6, 3], [-6.4, 2.3, 1.6]].forEach(([x, y, size]) =>
    s.glow({ x, y, z: 0.2, size, color: '#ffb258', intensity: 0.45, flicker: 0.14 }));
  const motes = ambient({ count: 80, box: [-8, 8, -3, 4], z: 0.4, depth: 1.5, life: 16, vel: [0.3, 0.6, 0], size: 0.03, color: '#ffe2a8', opacity: 0.45 });
  s.scene.add(motes);
  s.updaters.push((t) => motes.tick(t));
  const dim = new THREE.Color('#6d6257'), lit = new THREE.Color('#ffffff');
  s.pose = (st, tl, instant) => {
    const o = st.sinnett ?? 0;
    // "rack focus": whoever the beat is about stays lit, the others fall back
    const toHpb = !!st.lookHpb;
    const set = (mat, c) => instant ? mat.color.copy(c) : tl.to(mat.color, { r: c.r, g: c.g, b: c.b, duration: 1.2 }, 0);
    if (instant) sinnett.material.opacity = o; else tl.to(sinnett.material, { opacity: o, duration: 1.2 }, 0.2);
    set(hume.material, toHpb ? dim : lit);
    set(sinnett.material, toHpb ? dim : lit);
    set(hpb.material, toHpb ? lit : new THREE.Color('#d8cfc4'));
  };
  return s;
}

// Sinnett's study, late at night.
function studySet(tx) {
  const s = new Set({ name: 'study', background: '#16130f' });
  s.layer(tx['study'], { z: 0, overscan: 1.14 });
  s.glow({ x: -2.25, y: 0.3, z: 0.2, size: 5.5, color: '#ffb35e', intensity: 0.6, flicker: 0.1 });
  s.glow({ x: -2.25, y: 0.55, z: 0.25, size: 1.2, color: '#fff0c8', intensity: 0.9, flicker: 0.2 });
  const pane = mist({ width: 2.3, height: 2.0, x: 2.75, y: 2.2, z: 0.05, k: s.k(0.05), opacity: 0.55 });
  s.scene.add(pane);
  const motes = ambient({ count: 60, box: [-5, 1, -2, 3], z: 0.4, depth: 1, life: 18, vel: [0.2, 0.5, 0], size: 0.03, color: '#ffe2a8', opacity: 0.4 });
  s.scene.add(motes);
  s.updaters.push((t) => { pane.tick(t); motes.tick(t); });
  return s;
}

// The doorway. A portrait plate, shown whole in the dark.
function doorSet(tx) {
  const s = new Set({ name: 'door', background: '#0b0d11' });
  s.contained(tx['doorway'], { z: 0, height: 9.6 });
  const hpb = s.figure(tx['char-blavatsky'], { x: -0.1, bottom: -5.7, width: 4.4, z: 0.4, tint: '#e9d3b8' });
  const candle = s.glow({ x: 1.5, y: -1.0, z: 0.7, size: 3.2, color: '#ffb04a', intensity: 0.85, flicker: 0.35 });
  s.pose = (st, tl, instant) => {
    const here = st.hpb ?? 1;
    if (instant) {
      hpb.material.opacity = here; candle.base = here * 0.85;
      candle.sprite.position.set(here ? 1.5 : 0.9, here ? -1.0 : 0.3, 0.7);
      return;
    }
    tl.to(hpb.material, { opacity: here, duration: 1.8, ease: 'power1.inOut' }, 0.2);
    // the candle leaves with her, down the corridor
    tl.to(candle.sprite.position, { x: here ? 1.5 : 0.9, y: here ? -1.0 : 0.3, duration: 2.2, ease: 'power1.inOut' }, 0.2);
    tl.to(candle, { base: here * 0.85, duration: 2.4, ease: 'power1.in' }, 0.3);
  };
  return s;
}

export function build(tx) {
  return {
    ink: inkSet(), hill: hillSet(tx), dig: digSet(tx), fire: fireSet(tx),
    brooch: broochSet(tx), hume: humeSet(tx), study: studySet(tx), door: doorSet(tx),
  };
}

// --------------------------------------------------------------- beats ------

const CH = 'Chapter 1 · <b>The Marvels of Simla</b>';

export const beats = [
  // title page
  { set: 'ink', layout: 'title', folio: 'The Mahatma Letters · <b>Letter No. 1</b>', hint: true,
    cam: { x: 0, y: 0, zoom: 1 },
    cap: [{ kicker: 'The Mahatma Letters to A. P. Sinnett', title: 'Letter No. 1', deck: 'Simla, 1880. An editor asks for a miracle, and receives a refusal.' }] },

  // chapter card
  { set: 'ink', layout: 'chapter', folio: CH, duration: 2.2,
    cam: { x: 0.6, y: 0.4, zoom: 1.18 },
    cap: [{ chapter: 'Chapter 1', title: 'The Marvels of Simla', card: 'Simla. The summer capital of British India. Early October, 1880.' }] },

  // ---- the hillside
  { set: 'hill', folio: CH, transition: 'ink', tDuration: 1.8, duration: 4,
    from: { y: 3.6, ty: 3.8, zoom: 1.6 }, cam: { x: 0, y: 2.1, ty: 2.3, zoom: 1.35, focus: 0 }, state: { sinnett: 0 },
    cap: [{ narr: 'Deodar pines on a steep slope, and far off the white wall of the Himalaya.' }] },
  { set: 'hill', folio: CH, duration: 3.4,
    cam: { x: 0, y: 0, ty: -0.2, zoom: 1, focus: -1.5 }, state: { sinnett: 0 },
    cap: [{ narr: 'A picnic on rugs under the trees: a dozen English men and women in autumn tweeds and bonnets. Madame Blavatsky sits heavily on a folding chair, bored by the English. Colonel Olcott sits beside her.' }] },
  { set: 'hill', folio: CH, duration: 2.2,
    cam: { x: 2.6, y: -0.3, ty: -0.3, zoom: 1.12, focus: 5.3 }, state: { sinnett: 1 },
    cap: [{ narr: 'Mr. Sinnett, editor of the *Pioneer*, stands apart with his notebook, watching everything like a man who writes for a living.' }] },
  { set: 'hill', folio: CH, duration: 2,
    cam: { x: 3.4, y: -0.6, ty: -0.6, zoom: 1.4, focus: 4.6 },
    cap: [{ narr: 'A servant lays out the tea things. Counts. Counts again.' }, { who: 'Servant', line: 'One cup short, memsahib.' }] },
  { set: 'hill', folio: CH, duration: 2.2,
    cam: { x: -0.8, y: -0.4, ty: -0.4, zoom: 1.15, focus: -1.5 },
    cap: [{ who: 'A guest', line: 'Then someone must go without. Madame, I suppose you could not conjure us one?' }, { narr: 'Madame does not laugh.' }] },
  { set: 'hill', folio: CH, duration: 2.6,
    cam: { x: -1.5, y: -1.6, ty: -2.6, zoom: 1.55, focus: -1.5 },
    cap: [{ narr: 'Slowly, she points at the ground between the roots of a tree.' }, { who: 'Blavatsky', line: 'Dig. There.' }] },

  // ---- the dig
  { set: 'dig', folio: CH, transition: 'zoom', tDuration: 1.5, duration: 2.6,
    from: { zoom: 1.7 }, cam: { x: 0, y: 0, zoom: 1.12, focus: 0.8 }, state: { removed: 0, knife: 'in' },
    cap: [{ narr: 'Someone snorts. A young officer grins, takes a knife from the hamper and kneels, playing along.' }] },
  { set: 'dig', folio: CH, duration: 1.8,
    cam: { x: 0.3, y: -0.1, zoom: 1.2, focus: 0.8 }, state: { removed: 5, knife: 'scrape' },
    cap: [{ narr: 'He scrapes at the earth.' }] },
  { set: 'dig', folio: CH, duration: 1.8,
    cam: { x: 0.5, y: -0.2, zoom: 1.32, focus: 0.8 }, state: { removed: 10, knife: 'scrape' },
    cap: [{ narr: 'Roots. Stones. More earth.' }] },
  { set: 'dig', folio: CH, duration: 1.6, hold: 1.2,
    cam: { x: 0.6, y: -0.3, zoom: 1.42, focus: 0.8 }, state: { removed: 12, knife: 'strike' },
    cap: [{ line: 'His knife strikes something hard.' }, { narr: 'He stops grinning.' }] },
  { set: 'dig', folio: CH, duration: 3.2, hold: 1.4,
    cam: { x: CUP.x, y: CUP.y, zoom: 2.1, focus: CUP.x }, state: { removed: 13, knife: 'off', glint: 0.55 },
    cap: [{ narr: 'He brushes the soil away. White china. A cup, then a saucer, packed in earth.' }] },
  { set: 'dig', folio: CH, duration: 2.4,
    cam: { x: CUP.x, y: CUP.y + 0.1, zoom: 1.8, focus: CUP.x }, state: { removed: 13, glint: 0.4 },
    cap: [{ narr: 'He holds them up beside the others.' }, { line: 'They match the set.' }] },
  { set: 'dig', folio: CH, duration: 2.6,
    cam: { x: 0.2, y: 0, zoom: 1.08, focus: CUP.x }, state: { removed: 13, glint: 0.25 },
    cap: [{ narr: 'Silence on the hillside. Then everyone speaks at once.' }, { who: 'A guest', line: 'It can’t be. It cannot be.' }, { who: 'Another guest, dry', line: 'A clever servant and a spade the night before.' }] },

  // ---- dusk by the fire
  { set: 'fire', folio: CH, transition: 'ink', tDuration: 1.8, duration: 4,
    from: { zoom: 1.3, y: 0.6 }, cam: { x: 0, y: 0, zoom: 1.04, focus: 0 },
    cap: [{ who: 'Sinnett, quietly', line: 'You saw her. She never left that chair.' }, { who: 'Olcott', line: 'She rarely needs to.' }] },
  { set: 'fire', folio: CH, duration: 2.4,
    cam: { x: 0.3, y: -1.1, zoom: 1.45, focus: 0.3 },
    cap: [{ narr: 'The party has thinned. Madame tears the corner from a cigarette paper and hands it to a guest to hold. Moments later the guest gasps at something in her palm. We do not see what she sees.' }] },
  { set: 'fire', folio: CH, duration: 2.4,
    cam: { x: 3.4, y: -0.4, zoom: 1.32, focus: 5.4 },
    cap: [{ narr: 'Sinnett sits a little apart, writing by firelight, filling page after page.' }] },
  { set: 'fire', folio: CH, duration: 2.8,
    cam: { x: 0.6, y: 0.2, zoom: 1.0, focus: 3 },
    cap: [{ who: 'Patience Sinnett, from the dark', line: 'Alfred, you will run out of paper before she runs out of wonders.' }, { narr: 'He smiles without looking up. Her hand rests on his shoulder for a moment, then is gone.' }] },

  // ---- Hume's drawing room
  { set: 'brooch', folio: CH, transition: 'burn', tDuration: 2, duration: 3.6,
    from: { zoom: 1.0, x: 0 }, cam: { x: 1.2, y: 1.5, zoom: 1.28, focus: 1.9 },
    cap: [{ narr: 'After dinner at Mr. Hume’s. Guests come in from the garden, excited. A woman’s hand holds a small brooch up to the lamp.' }, { who: 'Mrs. Hume', line: 'I lost it years ago. Years.' }] },
  { set: 'hume', folio: CH, transition: 'fade', tDuration: 1.1, duration: 3,
    from: { x: 3, zoom: 1.25 }, cam: { x: -1.4, y: 0, zoom: 1.12, focus: -5 }, state: { sinnett: 0 },
    cap: [{ narr: 'Madame stays in her chair, smoking. Hume does not move from the mantelpiece. He watches Madame Blavatsky, not the brooch.' }] },
  { set: 'hume', folio: CH, duration: 2.2,
    cam: { x: -2.6, y: -0.3, zoom: 1.3, focus: -3.4 }, state: { sinnett: 1 },
    cap: [{ who: 'Sinnett', line: 'Well, Hume?' }, { who: 'Hume, pleasantly', line: 'Well. A charming evening, and a lady made very happy.' }, { who: 'Sinnett', line: 'That is not an answer.' }] },
  { set: 'hume', folio: CH, duration: 2.4,
    cam: { x: -4.2, y: -0.2, zoom: 1.55, focus: -5.1 }, state: { sinnett: 1 },
    cap: [{ who: 'Hume', line: 'Ask me what I can prove, and I shall tell you: nothing, yet.' }, { narr: 'Ask him what a jury of sensible men would say, and Sinnett knows it already.' }] },
  { set: 'hume', folio: CH, duration: 2.8,
    cam: { x: 3.9, y: -0.4, zoom: 1.5, focus: 5.2 }, state: { sinnett: 1, lookHpb: true },
    cap: [{ who: 'Sinnett', line: 'Then we must give the sensible men something they cannot explain away.' }, { narr: 'Across the room, Madame looks up and meets his eye. She has heard every word.' }] },

  // ---- the study
  { set: 'study', folio: CH, transition: 'ink', tDuration: 1.8, duration: 4,
    from: { zoom: 1.25 }, cam: { x: 0, y: 0, zoom: 1.02, focus: -1 },
    cap: [{ narr: 'Later that night. A narrow, cluttered room. On the desk, the *Pioneer*, folded open at his own report of the Simla wonders. Beside it, a mocking reply. And the cup from the picnic: he has kept it.' }] },
  { set: 'study', folio: CH, duration: 2.4,
    cam: { x: -1.2, y: -0.3, zoom: 1.16, focus: -2 },
    cap: [{ who: 'Sinnett, to himself', line: 'One case. One story. And they laugh at it over breakfast.' }] },
  { set: 'study', folio: CH, duration: 2.6,
    cam: { x: -0.4, y: -1.5, zoom: 1.5, focus: -0.4 },
    cap: [{ narr: 'He sits, pulls a clean sheet toward him, and dips his pen.' }] },
  { set: 'study', folio: CH, layout: 'side', duration: 3,
    cam: { x: -0.2, y: -2.0, zoom: 2.0, focus: -0.2 },
    cap: [{ manuscript: ['…a test which no reasonable man could dispute…', '…a newspaper, printed in London, here in Simla on the very day of its publication…', 'Give me that, and I will put it before the world. Half London would be converted if you could deliver them a *Pioneer* on its day of publication.'] }] },

  // ---- the doorway
  { set: 'door', folio: CH, transition: 'fade', tDuration: 1.6, duration: 3.4,
    from: { zoom: 1.3 }, cam: { x: 0, y: 0, zoom: 1.04 }, state: { hpb: 1 },
    cap: [{ narr: 'A knock. Madame Blavatsky in the doorway, a shawl around her shoulders, a candle in her hand.' }, { who: 'Blavatsky', line: 'You are writing to them.' }, { who: 'Sinnett', line: 'I am writing to whoever reads what I give you. Will you send it?' }] },
  { set: 'door', folio: CH, duration: 2.4,
    cam: { x: 0, y: 0.5, zoom: 1.18 }, state: { hpb: 1 },
    cap: [{ narr: 'She takes the letter. She does not read it.' }, { who: 'Blavatsky', line: 'They do not do tricks for editors, my dear Mr. Sinnett.' }, { who: 'Sinnett', line: 'It is not a trick if it is true. That is the whole point.' }] },
  { set: 'door', folio: CH, duration: 2.4,
    cam: { x: 0, y: 1.0, zoom: 1.34 }, state: { hpb: 1 },
    cap: [{ who: 'Blavatsky, tired', line: 'You think the world is waiting for proof. You have not seen what the world does with it.' }, { who: 'Sinnett', line: 'Then let them tell me so themselves.' }] },
  { set: 'door', folio: CH, duration: 3.2, hold: 1.6,
    cam: { x: 0, y: 0.2, zoom: 1.08 }, state: { hpb: 0 },
    cap: [{ narr: 'She tucks the letter into her shawl.' }, { who: 'Blavatsky', line: 'They will.' }, { narr: 'She goes. The candle’s glow leaves with her.' }] },

  // ---- end card
  { set: 'ink', layout: 'chapter', folio: CH, transition: 'iris', tDuration: 2.4, duration: 3,
    from: { zoom: 1.3 }, cam: { x: -0.4, y: -0.3, zoom: 1.08 },
    cap: [{ end: 'End of Chapter 1.', next: 'Next: Chapter 2, <i>Unthinkable</i> (in preparation)', small: 'The letter: *The Mahatma Letters to A. P. Sinnett*, Letter No. 1, ed. A. T. Barker (1923). This chapter is a dramatized prologue: its scenes and dialogue are invented from the historical context, not quoted from the letter. Illustrations generated with Google Gemini.' }] },
];
