// A set is one location: a three.js scene of image planes at different depths,
// filmed by a perspective camera.
//
// Layout uses FRAME units. The frame is the 16 x 9 rectangle the camera sees
// from its home position (x and y run -8..8 and -4.5..4.5, origin at centre).
// A layer placed "in the frame" at depth z is scaled and positioned so that,
// from home, it lands exactly where a flat 2D composite would put it. Moving
// the camera then separates the layers by their real depth, which is the
// parallax.
import * as THREE from 'three';

export const FRAME_W = 16, FRAME_H = 9;
const FOV = 32;
const D = (FRAME_H / 2) / Math.tan(THREE.MathUtils.degToRad(FOV / 2));   // home distance

export class Set {
  constructor({ name, background = '#111318', frame = [FRAME_W, FRAME_H] } = {}) {
    this.name = name;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(background);
    this.frameW = frame[0]; this.frameH = frame[1];
    this.camera = new THREE.PerspectiveCamera(FOV, 16 / 9, 0.05, 200);
    // Camera rig, tweened by beats. zoom 1 = home distance; focus is the frame
    // x to centre on when the screen is narrower than the frame (phones).
    this.cam = { x: 0, y: 0, zoom: 1, tx: null, ty: null, roll: 0, focus: 0, shake: 0 };
    this.breathers = [];
    this.flickers = [];
    this.updaters = [];
    this.textures = {};
  }

  get D() { return D; }

  // ---- layout helpers ------------------------------------------------------

  // Scale factor that makes something at depth z look frame-sized from home.
  k(z) { return (D - z) / D; }

  material(tex, opts = {}) {
    return new THREE.MeshBasicMaterial({
      map: tex, transparent: true, depthWrite: false, toneMapped: false,
      color: opts.tint ? new THREE.Color(opts.tint) : 0xffffff, opacity: opts.opacity ?? 1,
    });
  }

  // A full-frame layer (a background plate or a cut-out plane the size of the
  // frame). `overscan` grows it so camera moves never reveal its edge.
  layer(tex, { z = 0, overscan = 1.12, tint, opacity, order } = {}) {
    const k = this.k(z);
    const img = tex.image;
    const aspect = img.width / img.height;
    // cover the frame at this depth
    let w = this.frameW, h = this.frameW / aspect;
    if (h < this.frameH) { h = this.frameH; w = h * aspect; }
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w * k * overscan, h * k * overscan), this.material(tex, { tint, opacity }));
    mesh.position.set(0, 0, z);
    mesh.renderOrder = order ?? Math.round(z * 100);
    this.scene.add(mesh);
    return mesh;
  }

  // A plate shown whole inside the frame ("contain"), used for portrait images.
  contained(tex, { z = 0, height = this.frameH, x = 0, y = 0, order } = {}) {
    const k = this.k(z);
    const img = tex.image;
    const h = height, w = h * img.width / img.height;
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w * k, h * k), this.material(tex));
    mesh.position.set(x * k, y * k, z);
    mesh.renderOrder = order ?? Math.round(z * 100);
    this.scene.add(mesh);
    return mesh;
  }

  // A cut-out placed by its frame position: centre x, bottom edge y, and width,
  // all in frame units. Pivots at its bottom so breathing grows it upward.
  figure(tex, { x = 0, bottom = -4.5, width = 3, z = 0, tint, opacity = 1, breathe = true, order } = {}) {
    const k = this.k(z);
    const img = tex.image;
    const w = width * k, h = width * (img.height / img.width) * k;
    const geo = new THREE.PlaneGeometry(w, h);
    geo.translate(0, h / 2, 0);                         // pivot at the bottom edge
    const mesh = new THREE.Mesh(geo, this.material(tex, { tint, opacity }));
    mesh.position.set(x * k, bottom * k, z);
    mesh.renderOrder = order ?? Math.round(z * 100) + 1;
    this.scene.add(mesh);
    if (breathe) this.breathers.push({ mesh, phase: Math.random() * 6.28, rate: 0.9 + Math.random() * 0.4 });
    return mesh;
  }

  // A soft additive light: a lamp, a fire, a candle. flicker 0 = steady.
  glow({ x = 0, y = 0, z = 0.1, size = 2, color = '#ffb060', intensity = 1, flicker = 0.25 } = {}) {
    const k = this.k(z);
    const mat = new THREE.SpriteMaterial({
      map: glowTexture(), color: new THREE.Color(color), transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false, opacity: intensity, toneMapped: false,
    });
    const s = new THREE.Sprite(mat);
    s.scale.set(size * k, size * k, 1);
    s.position.set(x * k, y * k, z);
    s.renderOrder = 900;
    this.scene.add(s);
    const f = { sprite: s, base: intensity, amount: flicker, seed: Math.random() * 100, level: 1 };
    this.flickers.push(f);
    return f;
  }

  // ---- camera ----------------------------------------------------------------

  resize(w, h) {
    this.viewAspect = w / h;
    this.camera.aspect = this.viewAspect;
    // Keep the frame's height in view; on screens wider than the frame, fit
    // its width instead so nothing is lost off the top and bottom.
    const fa = this.frameW / this.frameH;
    if (this.viewAspect > fa) {
      const halfW = this.frameW / 2 / this.viewAspect;
      this.camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(halfW / D));
    } else {
      this.camera.fov = FOV;
    }
    this.camera.updateProjectionMatrix();
  }

  // How much of the frame width is off-screen on narrow screens (0 on desktop).
  get narrow() {
    const visible = Math.min(this.frameH * this.viewAspect, this.frameW);
    return Math.max(0, 1 - visible / this.frameW);
  }

  applyCamera(t) {
    const c = this.cam, n = this.narrow;
    // On narrow screens the camera slides from its desktop x toward the beat's
    // subject (focus), and close-ups ease off, since a phone already sees a
    // tight slice of the frame.
    const fx = (c.focus - c.x) * n;
    const zoom = 1 + (c.zoom - 1) * (1 - n * 0.65);
    const sx = c.shake ? (Math.sin(t * 53) + Math.sin(t * 31)) * 0.04 * c.shake : 0;
    const sy = c.shake ? (Math.cos(t * 47) + Math.sin(t * 29)) * 0.04 * c.shake : 0;
    const x = c.x + fx + sx, y = c.y + sy;
    this.camera.position.set(x, y, D / zoom);
    this.camera.lookAt(c.tx == null ? x : c.tx + fx, c.ty == null ? y : c.ty, 0);
    if (c.roll) this.camera.rotateZ(c.roll);
  }

  // ---- per frame ---------------------------------------------------------

  update(t, dt) {
    this.applyCamera(t);
    for (const b of this.breathers) {
      const s = 1 + Math.sin(t * b.rate + b.phase) * 0.006;
      b.mesh.scale.set(1 + (s - 1) * 0.4, s, 1);
    }
    for (const f of this.flickers) {
      const n = Math.sin(t * 7.3 + f.seed) * 0.5 + Math.sin(t * 13.1 + f.seed * 2) * 0.3 + Math.sin(t * 23.7 + f.seed * 3) * 0.2;
      f.sprite.material.opacity = Math.max(0, f.base * f.level * (1 + n * f.amount));
    }
    for (const u of this.updaters) u(t, dt);
  }

  // Beats call this with their `state`. Sets override to animate their own
  // props (pieces of earth, a fading figure). Must be safe to call backwards.
  pose(state, tl, instant) {}
}

let _glow;
function glowTexture() {
  if (_glow) return _glow;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.25, 'rgba(255,255,255,0.45)');
  grd.addColorStop(0.6, 'rgba(255,255,255,0.08)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
  _glow = new THREE.CanvasTexture(c);
  _glow.colorSpace = THREE.SRGBColorSpace;
  return _glow;
}
