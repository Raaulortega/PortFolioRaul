// Shared world definition: terrain height field, river path, village location,
// quality tiers and the scroll-driven journey state read by the 3D scene.
import { createNoise2D, fbm, ridged, smoothstep, lerp } from './noise';

const noiseA = createNoise2D(7);
const noiseB = createNoise2D(21);
const noiseC = createNoise2D(42);

export const TERRAIN_WIDTH = 1000;    // X extent
export const TERRAIN_DEPTH = 1800;    // Z extent
export const TERRAIN_OFFSET_Z = -200; // Plane centre on Z (extends further into the distance)
export const WATER_LEVEL = -1.1;

export const CLOUD_DECKS = [
  { y: 430, clusters: 16, opacity: 0.75, warmth: 0.0 },
  { y: 295, clusters: 22, opacity: 0.85, warmth: 0.25 },
  { y: 170, clusters: 30, opacity: 0.95, warmth: 0.55 },
];

/** Centre line of the winding river, as an X offset for a given Z. */
export function riverX(z) {
  return 22 * Math.sin(z * 0.011 + 0.6) + 9 * Math.sin(z * 0.029 + 2.1) - 8;
}

/** Horizontal distance from a point to the river centre line (approximate). */
export function riverDistance(x, z) {
  return Math.abs(x - riverX(z));
}

const VILLAGE_Z = -20;
export const VILLAGE_CENTER = { x: riverX(VILLAGE_Z) + 30, z: VILLAGE_Z };

/** Height of the base landscape before the river is carved in. */
function landHeight(x, z) {
  const dr = riverDistance(x, z);
  // Elliptical valley: long along Z so the river can flow into the distance.
  const r = Math.hypot(x * 0.85, z * 0.5);
  const ring = smoothstep(80, 360, r);

  const big = fbm(noiseA, x * 0.0025 + 10, z * 0.0025, 4) * 0.5 + 0.5;
  const crest = ridged(noiseB, x * 0.004, z * 0.004, 4);
  let mountain = ring * (60 + 170 * big) * (0.5 + 0.5 * crest) + ring * ring * 90;
  // The river cuts a gorge through the mountains at both ends of the valley.
  mountain *= smoothstep(10, 110, dr);

  const hills = (fbm(noiseC, x * 0.012, z * 0.012, 3) * 0.5 + 0.5) * 7 * smoothstep(6, 40, dr);
  let h = hills + mountain;

  // Flatten a gentle plateau where the village sits.
  const dv = Math.hypot(x - VILLAGE_CENTER.x, z - VILLAGE_CENTER.z);
  const flat = 1 - smoothstep(22, 50, dv);
  h = lerp(h, 2.2 + hills * 0.15, flat * 0.9);
  return h;
}

/** Final terrain height, including the carved river channel. */
export function heightAt(x, z) {
  const h = landHeight(x, z);
  const channel = 1 - smoothstep(4, 11, riverDistance(x, z));
  return lerp(h, -4.5, channel);
}

/** Approximate slope (0 = flat, >1 = very steep) from central differences. */
export function slopeAt(x, z) {
  const e = 1.5;
  const dx = heightAt(x + e, z) - heightAt(x - e, z);
  const dz = heightAt(x, z + e) - heightAt(x, z - e);
  return Math.min(Math.hypot(dx, dz) / (2 * e), 1.5);
}

/** Low-frequency noise used to cluster trees into groves. */
export function groveMask(x, z) {
  return fbm(noiseA, x * 0.018 + 100, z * 0.018 - 50, 3);
}

/** Medium-frequency noise used to vary grass tones. */
export function tintNoise(x, z) {
  return fbm(noiseC, x * 0.03 - 20, z * 0.03 + 70, 2);
}

/** Quality tier, decided once from screen size and CPU cores. */
export function getQuality() {
  if (typeof window === 'undefined') return 'high';
  const small = window.matchMedia('(max-width: 768px)').matches;
  const cores = navigator.hardwareConcurrency || 4;
  return small || cores <= 4 ? 'low' : 'high';
}

export const QUALITY_SETTINGS = {
  high: { terrainSegX: 160, terrainSegZ: 288, pines: 1500, oaks: 900, houses: 64, motes: 360, cloudDensity: 1, shadowMap: 2048, dpr: [1, 1.5], antialias: true },
  low:  { terrainSegX: 100, terrainSegZ: 180, pines: 600,  oaks: 380, houses: 40, motes: 140, cloudDensity: 0.6, shadowMap: 1024, dpr: [1, 1.25], antialias: false },
};

/**
 * Mutable journey state shared between the DOM scroll listener and the render loop.
 * `target` is the raw scroll progress of the sky section (0..1); `current` is the
 * damped value the scene actually uses. `pointer` holds normalised mouse coords.
 */
export const journey = { target: 0, current: 0, pointer: { x: 0, y: 0 } };

/** Camera keyframes along the sky-to-valley descent. `p` is journey progress. */
export const CAMERA_KEYS = [
  { p: 0.0,  pos: [0, 520, 340],  look: [0, 470, 0] },
  { p: 0.22, pos: [6, 430, 315],  look: [0, 360, 0] },
  { p: 0.45, pos: [-6, 300, 285], look: [4, 220, 0] },
  { p: 0.66, pos: [4, 175, 250],  look: [10, 80, -10] },
  { p: 0.82, pos: [-6, 108, 205], look: [18, 14, -20] },
  { p: 1.0,  pos: [-12, 60, 142], look: [22, 0, -28] },
];
