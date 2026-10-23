import * as THREE from 'three';
import './style.css';
import { Stage } from './core/stage.js';
import { Director } from './core/director.js';
import { Captions } from './core/captions.js';
import { bindInput } from './core/input.js';
import * as chapter1 from './scenes/letter-001/scene-01.js';

const $ = (s) => document.querySelector(s);
const ASSETS = `${import.meta.env.BASE_URL}assets/letter-001/`;

function webglOK() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); }
  catch { return false; }
}

async function loadTextures(names, onProgress) {
  const loader = new THREE.TextureLoader();
  const out = {};
  let done = 0;
  await Promise.all(names.map((n) => new Promise((resolve, reject) => {
    loader.load(`${ASSETS}${n}.webp`, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      out[n] = t;
      onProgress(++done / names.length);
      resolve();
    }, undefined, reject);
  })));
  return out;
}

function beatFromHash(n) {
  const m = location.hash.match(/beat-(\d+)/);
  return m ? Math.min(Math.max(parseInt(m[1], 10) - 1, 0), n - 1) : 0;
}

async function main() {
  if (!webglOK()) { document.body.classList.add('no-webgl'); return; }

  const bar = $('.loading__bar');
  const tx = await loadTextures(chapter1.textures, (p) => { bar.style.transform = `scaleX(${p})`; });

  const stage = new Stage($('#gl'));
  const sets = chapter1.build(tx);
  Object.values(sets).forEach((s) => stage.register(s));
  const beats = chapter1.beats;

  const folio = $('#folio'), progress = $('.progress__fill'), hint = $('.hint');
  const director = new Director({
    stage, sets, beats, captions: new Captions($('#captions')),
    onBeat(i, beat) {
      folio.innerHTML = beat.folio || '';
      progress.style.transform = `scaleX(${(i + 1) / beats.length})`;
      hint.classList.toggle('is-on', !!beat.hint);
      document.body.dataset.set = beat.set;
      history.replaceState(null, '', `#beat-${i + 1}`);
    },
  });

  stage.start();
  await director.go(beatFromHash(beats.length), { instant: true });
  document.body.classList.add('is-ready');

  bindInput({ next: () => director.next(), prev: () => director.prev(), isBusy: () => director.isBusy() });

  // chapter menu
  const menu = $('.menu'), toggle = $('.menu-toggle');
  toggle.addEventListener('click', () => {
    const open = menu.toggleAttribute('data-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('[data-beat]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    menu.removeAttribute('data-open'); toggle.setAttribute('aria-expanded', 'false');
    director.go(parseInt(a.dataset.beat, 10) - 1, { instant: true });
  }));
  addEventListener('hashchange', () => {
    const i = beatFromHash(beats.length);
    if (i !== director.i) director.go(i, { instant: true });
  });

  // for verification scripts: window.__story.go(n) / .state()
  window.__story = { go: (n) => director.go(n - 1, { instant: true }), count: beats.length, state: () => ({ beat: director.i + 1, busy: director.busy }) };
}

main().catch((err) => {
  console.error(err);
  document.body.classList.add('no-webgl');
});
