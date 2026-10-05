/* eslint-disable react-hooks/immutability -- three.js materials and uniforms are mutated inside useFrame by design. */
// Root of the 3D sky-to-valley journey. Lazy-loaded by SkyJourney so three.js
// never blocks the first paint of the page.
import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Clouds from './Clouds';
import Landscape from './Landscape';
import { CAMERA_KEYS, QUALITY_SETTINGS, VILLAGE_CENTER, heightAt, journey } from './world';
import { createRandom, smoothstep } from './noise';

const SUN_DIR = new THREE.Vector3(-0.62, 0.3, -0.5).normalize();

/** Sky / fog colour stops along the journey. */
const ATMOSPHERE_STOPS = [
  { p: 0.0,  top: '#2a6fdb', horizon: '#a6d3f7', bottom: '#dbeeff', fog: '#cfe6fb', fogNear: 420, fogFar: 1800 },
  { p: 0.55, top: '#3b82e0', horizon: '#c4e1f6', bottom: '#e8f2f9', fog: '#d8eaf7', fogNear: 320, fogFar: 1500 },
  { p: 0.83, top: '#4d8ddc', horizon: '#ffe0b6', bottom: '#f4dbb8', fog: '#f1dcc2', fogNear: 220, fogFar: 1200 },
  { p: 1.0,  top: '#5994dc', horizon: '#ffd39b', bottom: '#f1cfa2', fog: '#eed5b6', fogNear: 170, fogFar: 1050 },
].map((s) => ({
  ...s,
  top: new THREE.Color(s.top),
  horizon: new THREE.Color(s.horizon),
  bottom: new THREE.Color(s.bottom),
  fog: new THREE.Color(s.fog),
}));

function sampleAtmosphere(p, out) {
  let i = 0;
  while (i < ATMOSPHERE_STOPS.length - 2 && p > ATMOSPHERE_STOPS[i + 1].p) i++;
  const a = ATMOSPHERE_STOPS[i];
  const b = ATMOSPHERE_STOPS[i + 1];
  const t = smoothstep(a.p, b.p, p);
  out.skyTop.copy(a.top).lerp(b.top, t);
  out.horizon.copy(a.horizon).lerp(b.horizon, t);
  out.bottom.copy(a.bottom).lerp(b.bottom, t);
  out.fogColor.copy(a.fog).lerp(b.fog, t);
  out.fogNear = a.fogNear + (b.fogNear - a.fogNear) * t;
  out.fogFar = a.fogFar + (b.fogFar - a.fogFar) * t;
}

// ─── Sky dome ───────────────────────────────────────────────────────────────

const skyVertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const skyFragment = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uHorizon;
  uniform vec3 uBottom;
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  varying vec3 vDir;

  void main() {
    vec3 dir = normalize(vDir);
    float h = dir.y;
    vec3 color = h > 0.0
      ? mix(uHorizon, uTop, pow(smoothstep(0.0, 1.0, h), 0.55))
      : mix(uHorizon, uBottom, pow(smoothstep(0.0, 1.0, -h), 0.5));
    float sun = max(dot(dir, uSunDir), 0.0);
    color += uSunColor * (pow(sun, 6.0) * 0.28 + pow(sun, 60.0) * 0.35 + smoothstep(0.9993, 0.9997, sun) * 1.2);
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

function Sky({ atmosphere }) {
  const meshRef = useRef(null);
  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: skyVertex,
    fragmentShader: skyFragment,
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      uTop: { value: atmosphere.skyTop },
      uHorizon: { value: atmosphere.horizon },
      uBottom: { value: atmosphere.bottom },
      uSunDir: { value: atmosphere.sunDir },
      uSunColor: { value: atmosphere.sunColor },
    },
  }), [atmosphere]);

  // Keep the dome centred on the camera so it behaves like an infinite sky.
  useFrame(({ camera }) => {
    if (meshRef.current) meshRef.current.position.copy(camera.position);
  });

  return (
    <mesh ref={meshRef} material={material} renderOrder={-1} frustumCulled={false}>
      <sphereGeometry args={[3000, 32, 16]} />
    </mesh>
  );
}

// ─── Light motes ────────────────────────────────────────────────────────────

const moteVertex = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vTwinkle;
  void main() {
    vec3 p = position;
    p.x += sin(uTime * 0.30 + aSeed * 20.0) * 2.5;
    p.y += sin(uTime * 0.45 + aSeed * 13.0) * 1.6;
    p.z += cos(uTime * 0.27 + aSeed * 9.0) * 2.5;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = (0.7 + aSeed * 0.9) * uPixelRatio * (160.0 / -mv.z);
    vTwinkle = 0.55 + 0.45 * sin(uTime * 1.8 + aSeed * 30.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const moteFragment = /* glsl */ `
  uniform float uVisible;
  varying float vTwinkle;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(1.0, 0.9, 0.62, a * a * uVisible * vTwinkle);
    #include <colorspace_fragment>
  }
`;

function Motes({ count, reducedMotion }) {
  const { gl } = useThree();
  const { geometry, material } = useMemo(() => {
    const random = createRandom(303);
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const x = -90 + random() * 200;
      const z = -150 + random() * 250;
      positions[i * 3] = x;
      positions[i * 3 + 1] = Math.max(heightAt(x, z), 0) + 1.5 + random() * 26;
      positions[i * 3 + 2] = z;
      seeds[i] = random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    const mat = new THREE.ShaderMaterial({
      vertexShader: moteVertex,
      fragmentShader: moteFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: 1 },
        uVisible: { value: 0 },
      },
    });
    return { geometry: geo, material: mat };
  }, [count]);

  useFrame((state) => {
    material.uniforms.uTime.value = reducedMotion ? 0 : state.clock.elapsedTime;
    material.uniforms.uPixelRatio.value = gl.getPixelRatio();
    material.uniforms.uVisible.value = smoothstep(0.8, 0.97, journey.current);
  });

  return <points geometry={geometry} material={material} frustumCulled={false} renderOrder={20} />;
}

// ─── Camera rig ─────────────────────────────────────────────────────────────

/** Map journey progress onto the curve parameter using the keyframe timings. */
function toCurveParam(p) {
  const last = CAMERA_KEYS.length - 1;
  for (let i = 0; i < last; i++) {
    const a = CAMERA_KEYS[i];
    const b = CAMERA_KEYS[i + 1];
    if (p <= b.p) return (i + (p - a.p) / (b.p - a.p)) / last;
  }
  return 1;
}

function CameraRig({ reducedMotion }) {
  const rig = useMemo(() => ({
    posCurve: new THREE.CatmullRomCurve3(CAMERA_KEYS.map((k) => new THREE.Vector3(...k.pos)), false, 'centripetal'),
    lookCurve: new THREE.CatmullRomCurve3(CAMERA_KEYS.map((k) => new THREE.Vector3(...k.look)), false, 'centripetal'),
    pos: new THREE.Vector3(),
    look: new THREE.Vector3(),
    pointer: { x: 0, y: 0 },
  }), []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const lambda = reducedMotion ? 10 : 3.2;
    journey.current += (journey.target - journey.current) * (1 - Math.exp(-lambda * dt));
    if (Math.abs(journey.target - journey.current) < 1e-5) journey.current = journey.target;

    const u = toCurveParam(THREE.MathUtils.clamp(journey.current, 0, 1));
    rig.posCurve.getPoint(u, rig.pos);
    rig.lookCurve.getPoint(u, rig.look);

    if (!reducedMotion) {
      const k = 1 - Math.exp(-2.5 * dt);
      rig.pointer.x += (journey.pointer.x - rig.pointer.x) * k;
      rig.pointer.y += (journey.pointer.y - rig.pointer.y) * k;
      const t = state.clock.elapsedTime;
      rig.pos.x += rig.pointer.x * 7 + Math.sin(t * 0.35) * 1.2;
      rig.pos.y += -rig.pointer.y * 3.5 + Math.sin(t * 0.5) * 0.8;
      rig.look.x += rig.pointer.x * 3;
    }

    state.camera.position.copy(rig.pos);
    state.camera.lookAt(rig.look);
  });

  return null;
}

// ─── Scene ──────────────────────────────────────────────────────────────────

function Atmosphere({ atmosphere }) {
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new THREE.Fog(atmosphere.fogColor.clone(), atmosphere.fogNear, atmosphere.fogFar);
    return () => { scene.fog = null; };
  }, [scene, atmosphere]);

  useFrame(() => {
    sampleAtmosphere(journey.current, atmosphere);
    if (scene.fog) {
      scene.fog.color.copy(atmosphere.fogColor);
      scene.fog.near = atmosphere.fogNear;
      scene.fog.far = atmosphere.fogFar;
    }
  });
  return null;
}

function Lights({ shadowMapSize }) {
  const lightRef = useRef(null);
  const target = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.set(VILLAGE_CENTER.x - 10, 0, VILLAGE_CENTER.z + 10);
    return o;
  }, []);

  useEffect(() => {
    const light = lightRef.current;
    if (!light) return;
    light.target = target;
    light.position.copy(target.position).addScaledVector(SUN_DIR, 420);
    const cam = light.shadow.camera;
    cam.left = -170; cam.right = 170; cam.top = 170; cam.bottom = -170;
    cam.near = 50; cam.far = 900;
    cam.updateProjectionMatrix();
  }, [target]);

  return (
    <>
      <hemisphereLight args={['#cfe4fa', '#6f8f4a', 1.15]} />
      <directionalLight
        ref={lightRef}
        color="#ffd9aa"
        intensity={2.6}
        castShadow
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-bias={-0.0004}
        shadow-normalBias={0.6}
      />
      <primitive object={target} />
    </>
  );
}

/** Fires `onReady` once the first frames have rendered (shaders compiled). */
function ReadySignal({ onReady }) {
  const frames = useRef(0);
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    frames.current += 1;
    if (frames.current >= 3) {
      done.current = true;
      onReady?.();
    }
  });
  return null;
}

export default function Experience({ quality = 'high', reducedMotion = false, active = true, onReady }) {
  const settings = QUALITY_SETTINGS[quality];
  const atmosphere = useMemo(() => {
    const a = {
      skyTop: new THREE.Color(),
      horizon: new THREE.Color(),
      bottom: new THREE.Color(),
      fogColor: new THREE.Color(),
      fogNear: 400,
      fogFar: 1800,
      sunDir: SUN_DIR.clone(),
      sunColor: new THREE.Color('#ffd9a0'),
    };
    sampleAtmosphere(0, a);
    return a;
  }, []);
  // Clouds read colour + far distance from this live view of the atmosphere.
  const cloudFog = useMemo(() => ({
    color: atmosphere.fogColor,
    get far() { return atmosphere.fogFar; },
  }), [atmosphere]);

  return (
    <Canvas
      dpr={settings.dpr}
      shadows
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: settings.antialias, powerPreference: 'high-performance', alpha: false }}
      camera={{ fov: 55, near: 1, far: 6000, position: CAMERA_KEYS[0].pos }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <Atmosphere atmosphere={atmosphere} />
      <Sky atmosphere={atmosphere} />
      <Lights shadowMapSize={settings.shadowMap} />
      <CameraRig reducedMotion={reducedMotion} />
      <Landscape quality={settings} atmosphere={atmosphere} reducedMotion={reducedMotion} />
      <Clouds density={settings.cloudDensity} reducedMotion={reducedMotion} fog={cloudFog} />
      <Motes count={settings.motes} reducedMotion={reducedMotion} />
      <ReadySignal onReady={onReady} />
    </Canvas>
  );
}
