// The valley: flat-shaded low-poly terrain, a winding river with a reflective
// water shader, instanced swaying forests and an instanced village.
import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {
  TERRAIN_WIDTH, TERRAIN_DEPTH, TERRAIN_OFFSET_Z, WATER_LEVEL, VILLAGE_CENTER,
  heightAt, slopeAt, riverX, riverDistance, groveMask, tintNoise,
} from './world';
import { createRandom, smoothstep } from './noise';

// ─── Terrain ────────────────────────────────────────────────────────────────

const C = (hex) => new THREE.Color(hex);
const PALETTE = {
  riverbed: C('#5e8a64'),
  sand: C('#dcc995'),
  grassLight: C('#93cc58'),
  grassDeep: C('#5fab45'),
  meadow: C('#c3cf5c'),
  forestFloor: C('#4b8a3c'),
  rockLight: C('#a39684'),
  rockDark: C('#7a7066'),
  snow: C('#f6f8fb'),
};

function buildTerrainGeometry(segX, segZ) {
  const base = new THREE.PlaneGeometry(TERRAIN_WIDTH, TERRAIN_DEPTH, segX, segZ);
  base.rotateX(-Math.PI / 2);
  base.translate(0, 0, TERRAIN_OFFSET_Z);
  const pos = base.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    pos.setY(i, heightAt(pos.getX(i), pos.getZ(i)));
  }

  const geo = base.toNonIndexed();
  base.dispose();
  geo.computeVertexNormals();

  const p = geo.attributes.position;
  const colors = new Float32Array(p.count * 3);
  const random = createRandom(5);
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const ab = new THREE.Vector3();
  const n = new THREE.Vector3();
  const color = new THREE.Color();
  const grass = new THREE.Color();
  const rock = new THREE.Color();

  for (let i = 0; i < p.count; i += 3) {
    a.fromBufferAttribute(p, i);
    b.fromBufferAttribute(p, i + 1);
    c.fromBufferAttribute(p, i + 2);
    ab.subVectors(b, a);
    n.subVectors(c, b).cross(ab).normalize();
    if (n.y < 0) n.negate();

    const h = (a.y + b.y + c.y) / 3;
    const x = (a.x + b.x + c.x) / 3;
    const z = (a.z + b.z + c.z) / 3;
    const slope = 1 - n.y;
    const dr = riverDistance(x, z);
    const tint = tintNoise(x, z);

    if (h < WATER_LEVEL - 0.4) {
      color.copy(PALETTE.riverbed);
    } else {
      grass.copy(PALETTE.grassLight).lerp(PALETTE.grassDeep, tint * 0.5 + 0.5);
      if (tint > 0.35) grass.lerp(PALETTE.meadow, smoothstep(0.35, 0.7, tint) * 0.6);
      grass.lerp(PALETTE.forestFloor, smoothstep(18, 70, h));

      rock.copy(PALETTE.rockLight).lerp(PALETTE.rockDark, random());
      // Steep river banks stay sandy instead of turning into dark rock stripes.
      const rockAmount = Math.max(smoothstep(0.22, 0.42, slope), smoothstep(90, 150, h) * 0.8)
        * smoothstep(12, 20, dr);
      color.copy(grass).lerp(rock, rockAmount);

      const snow = smoothstep(150, 185, h + tint * 25) * (slope < 0.45 ? 1 : 0.35);
      color.lerp(PALETTE.snow, snow);

      const bank = (1 - smoothstep(10, 15, dr)) * (1 - smoothstep(1.5, 3.5, h));
      color.lerp(PALETTE.sand, bank);
    }

    // Subtle per-face jitter gives the low-poly facets some life.
    const jitter = 0.96 + random() * 0.08;
    for (let k = 0; k < 3; k++) {
      colors[(i + k) * 3] = color.r * jitter;
      colors[(i + k) * 3 + 1] = color.g * jitter;
      colors[(i + k) * 3 + 2] = color.b * jitter;
    }
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return geo;
}

function Terrain({ quality }) {
  const geometry = useMemo(
    () => buildTerrainGeometry(quality.terrainSegX, quality.terrainSegZ),
    [quality],
  );
  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial vertexColors flatShading roughness={0.95} metalness={0} />
    </mesh>
  );
}

// ─── Water ──────────────────────────────────────────────────────────────────

const waterVertex = /* glsl */ `
  varying vec3 vWorldPos;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorldPos = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const waterFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uSkyTop;
  uniform vec3 uHorizon;
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  uniform vec3 uFogColor;
  uniform float uFogNear;
  uniform float uFogFar;
  varying vec3 vWorldPos;

  void main() {
    vec2 p = vWorldPos.xz;
    float t = uTime;
    // Layered sine ripples flowing downstream (towards +Z).
    float dx = sin(p.x * 0.45 + t * 1.1) * 0.04 + sin((p.x + p.y) * 0.9 - t * 1.7) * 0.025
             + sin(p.x * 2.1 - p.y * 0.7 + t * 2.6) * 0.012;
    float dz = cos(p.y * 0.38 - t * 1.6) * 0.05 + cos((p.y - p.x) * 1.1 - t * 2.2) * 0.02
             + cos(p.y * 2.4 + p.x * 0.5 - t * 3.1) * 0.012;
    vec3 n = normalize(vec3(dx, 1.0, dz));

    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float fresnel = 0.08 + 0.6 * pow(1.0 - max(dot(n, viewDir), 0.0), 5.0);
    vec3 refl = reflect(-viewDir, n);
    vec3 sky = mix(uHorizon, uSkyTop, smoothstep(0.0, 0.6, refl.y));
    float sunDot = max(dot(refl, uSunDir), 0.0);
    float spec = pow(sunDot, 260.0) * 3.5 + pow(sunDot, 28.0) * 0.3;

    // Flowing streaks and tiny glints sell the movement of the current.
    float streak = smoothstep(0.82, 1.0, sin(p.y * 0.55 - t * 2.4 + sin(p.x * 0.4) * 1.5) * 0.5 + 0.5);
    float glint = smoothstep(0.985, 1.0, sin(p.x * 3.1 + t * 1.3) * sin(p.y * 2.7 - t * 2.9));

    vec3 deep = vec3(0.05, 0.34, 0.44);
    vec3 shallow = vec3(0.22, 0.62, 0.62);
    vec3 base = mix(deep, shallow, 0.5 + 0.5 * sin(p.x * 0.05 + p.y * 0.03));
    vec3 color = mix(base, sky, fresnel) + uSunColor * spec;
    color += vec3(0.85, 0.95, 1.0) * (streak * 0.07 + glint * 0.5);

    float dist = length(cameraPosition - vWorldPos);
    float fog = smoothstep(uFogNear, uFogFar, dist);
    color = mix(color, uFogColor, fog);

    gl_FragColor = vec4(color, 0.94);
    #include <colorspace_fragment>
  }
`;

function Water({ atmosphere, reducedMotion }) {
  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: waterVertex,
    fragmentShader: waterFragment,
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uSkyTop: { value: atmosphere.skyTop },
      uHorizon: { value: atmosphere.horizon },
      uSunDir: { value: atmosphere.sunDir },
      uSunColor: { value: atmosphere.sunColor },
      uFogColor: { value: atmosphere.fogColor },
      uFogNear: { value: atmosphere.fogNear },
      uFogFar: { value: atmosphere.fogFar },
    },
  }), [atmosphere]);

  useFrame((state) => {
    material.uniforms.uTime.value = reducedMotion ? 0 : state.clock.elapsedTime;
    material.uniforms.uFogNear.value = atmosphere.fogNear;
    material.uniforms.uFogFar.value = atmosphere.fogFar;
  });

  return (
    <mesh
      rotation-x={-Math.PI / 2}
      position={[0, WATER_LEVEL, TERRAIN_OFFSET_Z]}
      material={material}
      renderOrder={1}
    >
      <planeGeometry args={[TERRAIN_WIDTH, TERRAIN_DEPTH]} />
    </mesh>
  );
}

// ─── Forest ─────────────────────────────────────────────────────────────────

function pineGeometries() {
  const trunk = new THREE.CylinderGeometry(0.25, 0.38, 2.4, 5).translate(0, 1.2, 0);
  const foliage = mergeGeometries([
    new THREE.ConeGeometry(2.3, 4.2, 7).translate(0, 3.6, 0),
    new THREE.ConeGeometry(1.75, 3.4, 7).translate(0, 5.7, 0),
    new THREE.ConeGeometry(1.1, 2.8, 7).translate(0, 7.6, 0),
  ]);
  return { trunk, foliage };
}

function oakGeometries() {
  const trunk = new THREE.CylinderGeometry(0.3, 0.45, 3.0, 5).translate(0, 1.5, 0);
  const foliage = mergeGeometries([
    new THREE.IcosahedronGeometry(2.5, 0).translate(0, 4.6, 0),
    new THREE.IcosahedronGeometry(1.8, 0).translate(1.3, 5.6, 0.4),
    new THREE.IcosahedronGeometry(1.6, 0).translate(-1.1, 5.3, -0.6),
  ]);
  return { trunk, foliage };
}

/** Standard material with a vertex-shader wind sway driven by `uTime`. */
function createSwayMaterial(swayUniforms) {
  const material = new THREE.MeshStandardMaterial({ flatShading: true, roughness: 0.9 });
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = swayUniforms.uTime;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uTime;')
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        #ifdef USE_INSTANCING
          vec3 instanceOrigin = instanceMatrix[3].xyz;
          float bend = max(transformed.y - 1.6, 0.0);
          float phase = uTime * 1.25 + instanceOrigin.x * 0.05 + instanceOrigin.z * 0.07;
          float sway = (sin(phase) + 0.35 * sin(phase * 2.3 + 1.7)) * 0.045 * bend;
          transformed.x += sway;
          transformed.z += sway * 0.55;
        #endif`,
      );
  };
  return material;
}

function scatterTrees(count, accept, seed) {
  const random = createRandom(seed);
  const result = [];
  let attempts = 0;
  while (result.length < count && attempts < count * 25) {
    attempts++;
    const x = -470 + random() * 940;
    const z = -720 + random() * 1150;
    const candidate = accept(x, z, random);
    if (candidate) result.push(candidate);
  }
  return result;
}

function forestAccept(kind) {
  return (x, z, random) => {
    const h = heightAt(x, z);
    if (h < 0.8 || h > 135) return null;
    if (riverDistance(x, z) < 13) return null;
    if (Math.hypot(x - VILLAGE_CENTER.x, z - VILLAGE_CENTER.z) < 50) return null;
    if (slopeAt(x, z) > 0.85) return null;
    const grove = groveMask(x, z);
    if (grove < -0.05 && random() > 0.06) return null;
    // Pines dominate the slopes, broadleaf trees the valley floor.
    const pineChance = smoothstep(4, 35, h) * 0.85 + 0.15;
    const isPine = random() < pineChance;
    if ((kind === 'pine') !== isPine) return null;
    const scale = kind === 'pine' ? 0.9 + random() * 0.8 : 0.8 + random() * 0.6;
    return { x, y: h - 0.3, z, scale, rot: random() * Math.PI * 2, shade: random() };
  };
}

/** Writes per-instance transforms (and optional colours) into an InstancedMesh. */
function writeInstances(mesh, items, toTransform, toColor) {
  if (!mesh) return;
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const s = new THREE.Vector3();
  const v = new THREE.Vector3();
  const color = new THREE.Color();
  const up = new THREE.Vector3(0, 1, 0);
  items.forEach((item, i) => {
    const t = toTransform(item);
    q.setFromAxisAngle(up, t.rot);
    s.set(t.sx, t.sy, t.sz);
    v.set(t.x, t.y, t.z);
    m.compose(v, q, s);
    mesh.setMatrixAt(i, m);
    if (toColor) mesh.setColorAt(i, color.set(toColor(item)));
  });
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  mesh.computeBoundingSphere();
}

const treeTransform = (t) => ({ x: t.x, y: t.y, z: t.z, rot: t.rot, sx: t.scale, sy: t.scale, sz: t.scale });

function TreeSpecies({ kind, count, colors, swayUniforms }) {
  const { trunk, foliage } = useMemo(
    () => (kind === 'pine' ? pineGeometries() : oakGeometries()),
    [kind],
  );
  const trees = useMemo(
    () => scatterTrees(count, forestAccept(kind), kind === 'pine' ? 11 : 23),
    [count, kind],
  );
  const foliageMaterial = useMemo(() => createSwayMaterial(swayUniforms), [swayUniforms]);
  const foliageColor = (t) => colors[Math.floor(t.shade * colors.length) % colors.length];

  return (
    <>
      <instancedMesh
        ref={(mesh) => writeInstances(mesh, trees, treeTransform)}
        args={[trunk, undefined, trees.length]}
        castShadow
      >
        <meshStandardMaterial color="#6b4a33" flatShading roughness={1} />
      </instancedMesh>
      <instancedMesh
        ref={(mesh) => writeInstances(mesh, trees, treeTransform, foliageColor)}
        args={[foliage, foliageMaterial, trees.length]}
        castShadow
        receiveShadow
      />
    </>
  );
}

const PINE_COLORS = ['#2f6e3b', '#3b7d42', '#2a6237', '#467f3a', '#356f45'];
const OAK_COLORS = ['#5aa646', '#6db54b', '#4f9a3f', '#86b94a', '#7aad3f', '#62a842', '#93c04e', '#e0a43a', '#d9823a'];

function Forest({ quality, reducedMotion }) {
  const swayUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame((state) => {
    swayUniforms.uTime.value = reducedMotion ? 0 : state.clock.elapsedTime;
  });
  return (
    <>
      <TreeSpecies kind="pine" count={quality.pines} colors={PINE_COLORS} swayUniforms={swayUniforms} />
      <TreeSpecies kind="oak" count={quality.oaks} colors={OAK_COLORS} swayUniforms={swayUniforms} />
    </>
  );
}

// ─── Village ────────────────────────────────────────────────────────────────

/** Gabled roof prism sitting on top of a unit box (base at y = 1). */
function roofGeometry() {
  const w = 0.58;  // half width incl. overhang (X)
  const d = 0.56;  // half depth incl. overhang (Z)
  const y0 = 0.98;
  const y1 = 1.55;
  const v = [
    // Front gable
    -w, y0, d, w, y0, d, 0, y1, d,
    // Back gable
    w, y0, -d, -w, y0, -d, 0, y1, -d,
    // Left slope
    -w, y0, -d, -w, y0, d, 0, y1, d,
    -w, y0, -d, 0, y1, d, 0, y1, -d,
    // Right slope
    w, y0, d, w, y0, -d, 0, y1, -d,
    w, y0, d, 0, y1, -d, 0, y1, d,
    // Underside
    -w, y0, -d, w, y0, -d, w, y0, d,
    -w, y0, -d, w, y0, d, -w, y0, d,
  ];
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
  geo.computeVertexNormals();
  return geo;
}

const WALL_COLORS = ['#f7ecd8', '#f3dcc0', '#fbf3e6', '#eed2b0', '#f6e3c8', '#e9d8c3', '#f2e6cf'];
const ROOF_COLORS = ['#c4553a', '#b8462f', '#d06a3c', '#9c4a32', '#5f6f86', '#a8553c', '#c9633f'];

function placeHouses(count) {
  const random = createRandom(77);
  const houses = [];
  let attempts = 0;
  while (houses.length < count && attempts < count * 40) {
    attempts++;
    const angle = random() * Math.PI * 2;
    const radius = 11 + Math.sqrt(random()) * 42;
    const x = VILLAGE_CENTER.x + Math.cos(angle) * radius;
    const z = VILLAGE_CENTER.z + Math.sin(angle) * radius * 0.85;
    if (riverDistance(x, z) < 14) continue;
    if (slopeAt(x, z) > 0.35) continue;
    const w = 3.2 + random() * 1.8;
    const d = 3.2 + random() * 1.4;
    const tooClose = houses.some((o) => Math.hypot(o.x - x, o.z - z) < (o.w + w) * 0.5 + 2.2);
    if (tooClose) continue;
    const facing = Math.atan2(VILLAGE_CENTER.x - x, VILLAGE_CENTER.z - z);
    houses.push({
      x, z, w, d,
      y: heightAt(x, z) - 0.3,
      h: 2.6 + random() * 1.6,
      rot: facing + (random() - 0.5) * 0.35,
      wall: WALL_COLORS[Math.floor(random() * WALL_COLORS.length)],
      roof: ROOF_COLORS[Math.floor(random() * ROOF_COLORS.length)],
    });
  }
  return houses;
}

const houseTransform = (hs) => ({ x: hs.x, y: hs.y, z: hs.z, rot: hs.rot, sx: hs.w, sy: hs.h, sz: hs.d });

function Village({ quality }) {
  const houses = useMemo(() => placeHouses(quality.houses), [quality]);
  const bodyGeometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0), []);
  const roof = useMemo(() => roofGeometry(), []);

  // Church and bridge give the village a focal point.
  const church = useMemo(() => {
    const x = VILLAGE_CENTER.x + 2;
    const z = VILLAGE_CENTER.z - 1;
    return { x, z, y: heightAt(x, z) - 0.3 };
  }, []);

  const bridge = useMemo(() => {
    const z = VILLAGE_CENTER.z + 6;
    const slope = 22 * 0.011 * Math.cos(z * 0.011 + 0.6) + 9 * 0.029 * Math.cos(z * 0.029 + 2.1);
    return { x: riverX(z), z, rot: Math.atan(slope) };
  }, []);

  return (
    <group>
      <instancedMesh
        ref={(mesh) => writeInstances(mesh, houses, houseTransform, (hs) => hs.wall)}
        args={[bodyGeometry, undefined, houses.length]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial flatShading roughness={0.85} />
      </instancedMesh>
      <instancedMesh
        ref={(mesh) => writeInstances(mesh, houses, houseTransform, (hs) => hs.roof)}
        args={[roof, undefined, houses.length]}
        castShadow
      >
        <meshStandardMaterial flatShading roughness={0.75} />
      </instancedMesh>

      <group position={[church.x, church.y, church.z]} rotation-y={0.35}>
        <mesh position={[0, 3, 0]} castShadow receiveShadow>
          <boxGeometry args={[5.5, 6, 10]} />
          <meshStandardMaterial color="#f4e9d6" flatShading />
        </mesh>
        <mesh scale={[5.8, 6, 10.4]} geometry={roof} castShadow>
          <meshStandardMaterial color="#b8462f" flatShading />
        </mesh>
        <mesh position={[0, 7, -6]} castShadow>
          <boxGeometry args={[3.4, 14, 3.4]} />
          <meshStandardMaterial color="#efe2cb" flatShading />
        </mesh>
        <mesh position={[0, 17, -6]} rotation-y={Math.PI / 4} castShadow>
          <coneGeometry args={[2.7, 6, 4]} />
          <meshStandardMaterial color="#5f6f86" flatShading />
        </mesh>
      </group>

      <group position={[bridge.x, 0.9, bridge.z]} rotation-y={bridge.rot}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[26, 0.8, 4.2]} />
          <meshStandardMaterial color="#b98a5e" flatShading />
        </mesh>
        <mesh position={[0, 0.9, 1.95]}>
          <boxGeometry args={[26, 0.9, 0.3]} />
          <meshStandardMaterial color="#8f6845" flatShading />
        </mesh>
        <mesh position={[0, 0.9, -1.95]}>
          <boxGeometry args={[26, 0.9, 0.3]} />
          <meshStandardMaterial color="#8f6845" flatShading />
        </mesh>
      </group>
    </group>
  );
}

// ─── Assembly ───────────────────────────────────────────────────────────────

export default function Landscape({ quality, atmosphere, reducedMotion }) {
  return (
    <group>
      <Terrain quality={quality} />
      <Water atmosphere={atmosphere} reducedMotion={reducedMotion} />
      <Forest quality={quality} reducedMotion={reducedMotion} />
      <Village quality={quality} />
    </group>
  );
}
