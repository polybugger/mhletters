// The stage: one WebGL canvas for the whole story. Every set renders into an
// off-screen target, and a full-screen pass composites it to the screen. That
// pass is where transitions happen (two sets blended by a shader) and where
// the film finish lives (vignette and grain), so it is applied identically to
// every scene.
import * as THREE from 'three';

export const TRANSITIONS = { cut: -1, fade: 0, ink: 1, burn: 2, iris: 3, zoom: 4 };

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const frag = /* glsl */ `
  uniform sampler2D tA;
  uniform sampler2D tB;
  uniform float uP;        // transition progress, 0 = all A, 1 = all B
  uniform int uType;       // see TRANSITIONS
  uniform float uTime;
  uniform vec2 uRes;
  uniform float uGrain;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
               mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }
  // Where the edge of a growing mask sits: B wins where field < edge.
  float grow(float field, float edge, float soft) { return 1.0 - smoothstep(edge - soft, edge + soft, field); }

  void main() {
    vec2 uv = vUv;
    vec2 asp = vec2(uRes.x / uRes.y, 1.0);
    vec3 a = texture2D(tA, uv).rgb;
    vec3 col = a;

    if (uType >= 0) {
      float p = clamp(uP, 0.0, 1.0);
      vec3 b = texture2D(tB, uv).rgb;

      if (uType == 0) {                     // fade
        col = mix(a, b, smoothstep(0.0, 1.0, p));

      } else if (uType == 1) {              // ink: blots of the next scene bleed through
        float f = fbm(uv * asp * 3.2 + 1.7) * 0.85 + 0.15 * length((uv - 0.5) * asp);
        float e = p * 1.35 - 0.2;
        float m = grow(f, e, 0.035);
        float rim = exp(-pow((f - e) / 0.028, 2.0));
        col = mix(a, b, m);
        col = mix(col, vec3(0.012, 0.014, 0.02), rim * 0.9);

      } else if (uType == 2) {              // burn: the page chars from below
        float f = fbm(uv * asp * 4.0) * 0.55 + (1.0 - uv.y) * 0.55;
        float e = p * 1.45 - 0.25;
        float m = grow(f, e, 0.02);
        float rim = exp(-pow((f - e) / 0.035, 2.0));
        col = mix(a, b, m);
        col += vec3(1.0, 0.42, 0.08) * rim * 1.6;
        col = mix(col, vec3(0.02), exp(-pow((f - e - 0.06) / 0.03, 2.0)) * 0.7);

      } else if (uType == 3) {              // iris: close on A to black, open on B
        float r = p < 0.5 ? (1.0 - p * 2.0) : (p * 2.0 - 1.0);
        r *= 0.95;
        float d = length((uv - 0.5) * asp) / max(asp.x, 1.0) * 1.4;
        float inside = smoothstep(r, r - 0.012, d);
        col = (p < 0.5 ? a : b) * inside;

      } else if (uType == 4) {              // zoom: fall forward into the frame
        vec2 c = uv - 0.5;
        float z = 1.0 - smoothstep(0.0, 1.0, p) * 0.55;
        vec3 acc = vec3(0.0);
        for (int i = 0; i < 8; i++) {
          float k = z - float(i) * 0.012 * p;
          acc += texture2D(tA, 0.5 + c * k).rgb;
        }
        col = mix(acc / 8.0, b, smoothstep(0.35, 0.95, p));
      }
    }

    // film finish
    float v = length((uv - 0.5) * vec2(1.1, 1.0));
    col *= 1.0 - 0.34 * smoothstep(0.35, 0.95, v);
    col += (hash(uv * uRes + fract(uTime) * 91.0) - 0.5) * uGrain;
    gl_FragColor = vec4(max(col, 0.0), 1.0);
    #include <colorspace_fragment>
  }
`;

export class Stage {
  constructor(canvas) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.setPixelRatio(this.dpr);

    const opts = { type: THREE.HalfFloatType, depthBuffer: true };
    this.rtA = new THREE.WebGLRenderTarget(1, 1, opts);
    this.rtB = new THREE.WebGLRenderTarget(1, 1, opts);

    this.quad = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        vertexShader: vert, fragmentShader: frag,
        uniforms: {
          tA: { value: this.rtA.texture }, tB: { value: this.rtB.texture },
          uP: { value: 0 }, uType: { value: -1 }, uTime: { value: 0 },
          uRes: { value: new THREE.Vector2(1, 1) }, uGrain: { value: 0.03 },
        },
        depthTest: false, depthWrite: false,
      }),
    );
    this.post = new THREE.Scene();
    this.post.add(this.quad);
    this.postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    this.current = null;   // the set on screen
    this.next = null;      // the set being transitioned to
    this.trans = { p: 0 };
    this.clock = new THREE.Clock();
    this.sets = [];
    this.onFrame = null;

    this.resize = this.resize.bind(this);
    addEventListener('resize', this.resize);
    this.resize();
  }

  register(set) { this.sets.push(set); set.resize(this.w, this.h); }

  resize() {
    this.w = innerWidth; this.h = innerHeight;
    this.renderer.setSize(this.w, this.h, false);
    const pw = Math.round(this.w * this.dpr), ph = Math.round(this.h * this.dpr);
    this.rtA.setSize(pw, ph); this.rtB.setSize(pw, ph);
    this.quad.material.uniforms.uRes.value.set(pw, ph);
    this.sets.forEach((s) => s.resize(this.w, this.h));
  }

  // Cut straight to a set.
  show(set) { this.current = set; this.next = null; this.quad.material.uniforms.uType.value = -1; }

  // Blend from the current set to another. Resolves when the new set owns the screen.
  transition(set, type = 'fade', duration = 1.2, gsap) {
    const code = TRANSITIONS[type] ?? 0;
    if (code < 0 || !this.current) { this.show(set); return Promise.resolve(); }
    this.next = set;
    const u = this.quad.material.uniforms;
    u.uType.value = code; u.uP.value = 0;
    return new Promise((resolve) => {
      gsap.to(u.uP, {
        value: 1, duration, ease: type === 'iris' ? 'power1.inOut' : 'power2.inOut',
        onComplete: () => { this.show(set); resolve(); },
      });
    });
  }

  start() {
    const loop = () => {
      const dt = Math.min(this.clock.getDelta(), 0.05);
      const t = this.clock.elapsedTime;
      const u = this.quad.material.uniforms;
      u.uTime.value = t;
      if (this.current) {
        this.current.update(t, dt);
        this.renderer.setRenderTarget(this.rtA);
        this.renderer.render(this.current.scene, this.current.camera);
      }
      if (this.next) {
        this.next.update(t, dt);
        this.renderer.setRenderTarget(this.rtB);
        this.renderer.render(this.next.scene, this.next.camera);
      }
      this.renderer.setRenderTarget(null);
      this.renderer.render(this.post, this.postCam);
      if (this.onFrame) this.onFrame(t, dt);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
    // stop drawing while the tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(this.raf);
      else { this.clock.getDelta(); this.raf = requestAnimationFrame(loop); }
    });
  }
}
