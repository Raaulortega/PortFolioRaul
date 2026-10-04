// Volumetric-looking cloud decks built from camera-facing instanced sprites with a
// procedural fbm shader. One draw call per deck; no textures required.
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CLOUD_DECKS } from './world';
import { createRandom } from './noise';

const vertexShader = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uDrift;
  varying vec2 vUv;
  varying float vSeed;
  varying float vDepth;

  void main() {
    vUv = uv;
    vSeed = aSeed;
    vec4 worldCenter = modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    // Slow lateral drift so the sky feels alive.
    worldCenter.x += sin(uTime * 0.04 + aSeed * 6.2831) * 10.0 * uDrift;
    worldCenter.z += cos(uTime * 0.03 + aSeed * 4.0) * 6.0 * uDrift;

    vec4 mvCenter = viewMatrix * worldCenter;
    float scale = length(instanceMatrix[0].xyz);
    float angle = (aSeed - 0.5) * 0.6;
    vec2 corner = position.xy * vec2(1.0, 0.62);
    corner = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * corner;
    mvCenter.xy += corner * scale;

    vDepth = -mvCenter.z;
    gl_Position = projectionMatrix * mvCenter;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uWarmth;
  uniform vec3 uFogColor;
  uniform float uFogFar;
  varying vec2 vUv;
  varying float vSeed;
  varying float vDepth;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float s = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      s += a * vnoise(p);
      p *= 2.03;
      a *= 0.5;
    }
    return s;
  }

  void main() {
    // Drop sprites that are about to touch the camera to avoid hard clipping.
    if (vDepth < 3.0) discard;
    vec2 p = vUv * 2.0 - 1.0;
    float r = length(p);
    if (r > 1.0) discard;

    float n = fbm(vUv * 3.2 + vSeed * 17.0 + uTime * 0.012);
    float shape = smoothstep(1.0, 0.2, r + (n - 0.5) * 0.85);
    if (shape < 0.01) discard;

    vec3 lit = mix(vec3(1.0), vec3(1.0, 0.93, 0.84), uWarmth);
    vec3 shade = mix(vec3(0.76, 0.83, 0.93), vec3(0.93, 0.78, 0.72), uWarmth);
    float light = smoothstep(-0.7, 0.9, p.y + (n - 0.5) * 0.9);
    vec3 color = mix(shade, lit, light);

    float nearFade = smoothstep(3.0, 70.0, vDepth);
    float hazeMix = smoothstep(uFogFar * 0.35, uFogFar, vDepth);
    color = mix(color, uFogColor, hazeMix * 0.85);
    float alpha = shape * uOpacity * nearFade * (1.0 - smoothstep(uFogFar * 0.8, uFogFar * 1.1, vDepth));

    gl_FragColor = vec4(color, alpha);
    #include <colorspace_fragment>
  }
`;

function CloudDeck({ deck, index, density, reducedMotion, fog }) {
  const meshRef = useRef(null);
  const { geometry, material, puffs } = useMemo(() => {
    const random = createRandom(101 + index * 17);
    const list = [];
    const clusterCount = Math.round(deck.clusters * density);

    const addCluster = (cx, cz, size) => {
      const n = 5 + Math.floor(random() * 5);
      for (let i = 0; i < n; i++) {
        const a = random() * Math.PI * 2;
        const d = Math.sqrt(random()) * 55 * size;
        list.push({
          x: cx + Math.cos(a) * d,
          y: deck.y + (random() - 0.5) * 22,
          z: cz + Math.sin(a) * d * 0.7,
          s: (55 + random() * 75) * size,
        });
      }
    };

    for (let c = 0; c < clusterCount; c++) {
      addCluster(-520 + random() * 1040, -480 + random() * 980, 0.8 + random() * 0.7);
    }
    // Guarantee clouds right along the camera's descent path so they rush past.
    for (let c = 0; c < 4; c++) {
      addCluster(-70 + random() * 140, 200 + random() * 140, 0.7 + random() * 0.4);
    }

    const geo = new THREE.PlaneGeometry(1, 1);
    const seeds = new Float32Array(list.length);
    for (let i = 0; i < list.length; i++) seeds[i] = random();
    geo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uDrift: { value: reducedMotion ? 0 : 1 },
        uOpacity: { value: deck.opacity },
        uWarmth: { value: deck.warmth },
        uFogColor: { value: fog.color },
        uFogFar: { value: fog.far },
      },
    });

    return { geometry: geo, material: mat, puffs: list };
  }, [deck, index, density, reducedMotion, fog]);

  // Write instance matrices once the mesh is mounted.
  const setMesh = (mesh) => {
    meshRef.current = mesh;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    puffs.forEach((pf, i) => {
      m.makeScale(pf.s, pf.s, pf.s);
      m.setPosition(pf.x, pf.y, pf.z);
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uFogFar.value = fog.far;
    // Draw the deck farthest from the camera first so blending stays correct
    // whether we are above, inside or below it.
    if (meshRef.current) {
      meshRef.current.renderOrder = 10 - Math.abs(state.camera.position.y - deck.y) / 100;
    }
  });

  return (
    <instancedMesh
      ref={setMesh}
      args={[geometry, material, puffs.length]}
      frustumCulled={false}
    />
  );
}

/** `fog` is a shared mutable object `{ color: THREE.Color, far: number }` updated by the scene. */
export default function Clouds({ density = 1, reducedMotion = false, fog }) {
  return CLOUD_DECKS.map((deck, i) => (
    <CloudDeck
      key={deck.y}
      deck={deck}
      index={i}
      density={density}
      reducedMotion={reducedMotion}
      fog={fog}
    />
  ));
}
