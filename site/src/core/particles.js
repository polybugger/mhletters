// Particles. Ambient systems (dust in lamplight, sparks off a fire) are driven
// entirely on the GPU from time, so they cost nothing per frame in JS. Bursts
// (soil thrown up by the knife) are short-lived and simulated in JS.
import * as THREE from 'three';

const ambientVert = /* glsl */ `
  attribute vec4 aSeed;            // x: phase, y/z: drift phases, w: size jitter
  uniform float uTime;
  uniform float uLife;
  uniform vec3 uVel;               // travel over one life, frame units
  uniform vec3 uSway;              // sideways wander amplitude
  uniform float uSize;
  uniform float uScale;            // pixels per unit at distance 1
  varying float vA;
  void main() {
    float age = fract(uTime / uLife + aSeed.x);
    vec3 p = position + uVel * age;
    p.x += sin(uTime * 0.6 + aSeed.y * 6.283) * uSway.x;
    p.y += cos(uTime * 0.45 + aSeed.z * 6.283) * uSway.y;
    vA = sin(age * 3.14159) * (0.45 + 0.55 * aSeed.w);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * uScale * (0.5 + aSeed.w) / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;
const ambientFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vA;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vA * uOpacity;
    gl_FragColor = vec4(uColor * a, a);
  }
`;

// count particles spawned in box [x0,x1]x[y0,y1] at depth z (frame units).
export function ambient({ count = 120, box = [-8, 8, -4.5, 4.5], z = 0.5, depth = 0.6, life = 8,
  vel = [0, 0.6, 0], sway = [0.25, 0.15, 0], size = 0.06, color = '#ffe3b0', opacity = 0.6,
  additive = true } = {}) {
  const pos = new Float32Array(count * 3), seed = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = box[0] + Math.random() * (box[1] - box[0]);
    pos[i * 3 + 1] = box[2] + Math.random() * (box[3] - box[2]);
    pos[i * 3 + 2] = z + (Math.random() - 0.5) * depth;
    seed.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4));
  const mat = new THREE.ShaderMaterial({
    vertexShader: ambientVert, fragmentShader: ambientFrag, transparent: true, depthWrite: false,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    uniforms: {
      uTime: { value: 0 }, uLife: { value: life }, uVel: { value: new THREE.Vector3(...vel) },
      uSway: { value: new THREE.Vector3(...sway) }, uSize: { value: size },
      uScale: { value: innerHeight * Math.min(devicePixelRatio || 1, 2) },
      uColor: { value: new THREE.Color(color) }, uOpacity: { value: opacity },
    },
  });
  const points = new THREE.Points(geo, mat);
  points.renderOrder = 950;
  points.frustumCulled = false;
  points.tick = (t) => { mat.uniforms.uTime.value = t; };
  addEventListener('resize', () => { mat.uniforms.uScale.value = innerHeight * Math.min(devicePixelRatio || 1, 2); });
  return points;
}

// A pool of short-lived particles thrown from a point under gravity.
export function bursts({ max = 400, size = 0.07, color = '#3b2a1c', z = 0.4 } = {}) {
  const pos = new Float32Array(max * 3), alpha = new Float32Array(max);
  const vel = new Float32Array(max * 3), life = new Float32Array(max);
  let head = 0;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aAlpha', new THREE.BufferAttribute(alpha, 1));
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uColor: { value: new THREE.Color(color) }, uSize: { value: size }, uScale: { value: innerHeight * Math.min(devicePixelRatio || 1, 2) } },
    vertexShader: /* glsl */ `
      attribute float aAlpha; uniform float uSize; uniform float uScale; varying float vA;
      void main() { vA = aAlpha; vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = uSize * uScale / -mv.z; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; varying float vA;
      void main() { float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard;
        gl_FragColor = vec4(uColor, vA * smoothstep(0.5, 0.3, d)); }`,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  points.renderOrder = 960;

  points.emit = (x, y, n = 40, spread = 1) => {
    for (let i = 0; i < n; i++) {
      const j = head++ % max;
      pos.set([x + (Math.random() - 0.5) * 0.6 * spread, y + (Math.random() - 0.5) * 0.3 * spread, z], j * 3);
      const ang = Math.PI * (0.15 + Math.random() * 0.7), sp = 2 + Math.random() * 4;
      vel.set([Math.cos(ang) * sp * (Math.random() < 0.5 ? -1 : 1) * 0.6, Math.sin(ang) * sp, 0], j * 3);
      life[j] = 0.8 + Math.random() * 0.6;
      alpha[j] = 1;
    }
  };
  points.tick = (t, dt) => {
    for (let j = 0; j < max; j++) {
      if (life[j] <= 0) { alpha[j] = 0; continue; }
      life[j] -= dt;
      vel[j * 3 + 1] -= 9.5 * dt;
      pos[j * 3] += vel[j * 3] * dt;
      pos[j * 3 + 1] += vel[j * 3 + 1] * dt;
      alpha[j] = Math.min(1, life[j] * 2);
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.aAlpha.needsUpdate = true;
  };
  return points;
}

// A drifting sheet of mist, for a window pane.
export function mist({ width = 2, height = 2, x = 0, y = 0, z = 0.05, k = 1, opacity = 0.45, color = '#b9c6e6' } = {}) {
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(color) }, uOpacity: { value: opacity } },
    vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform vec3 uColor; uniform float uOpacity; varying vec2 vUv;
      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float n(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
        return mix(mix(h(i), h(i+vec2(1,0)), u.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), u.x), u.y); }
      float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ v += a*n(p); p *= 2.0; a *= 0.5; } return v; }
      void main(){
        vec2 p = vUv * 3.0 + vec2(uTime * 0.05, uTime * 0.02);
        float m = fbm(p + fbm(p * 0.7 - uTime * 0.03));
        float edge = smoothstep(0.0, 0.18, vUv.x) * smoothstep(1.0, 0.82, vUv.x) * smoothstep(0.0, 0.18, vUv.y) * smoothstep(1.0, 0.82, vUv.y);
        gl_FragColor = vec4(uColor, smoothstep(0.35, 0.85, m) * uOpacity * edge);
      }`,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width * k, height * k), mat);
  mesh.position.set(x * k, y * k, z);
  mesh.renderOrder = 940;
  mesh.tick = (t) => { mat.uniforms.uTime.value = t; };
  return mesh;
}
