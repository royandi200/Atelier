// Showroom 3D de ATELIER: un bar de lujo que se recorre con el scroll y se mira en 360° arrastrando.
// Todo es procedural (sin modelos externos): texturas en canvas y piezas armadas con primitivas.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export type ZoneId = 'bar' | 'booths' | 'lounge' | 'wine';

export interface Swatch {
  id: string;
  color: string;
}

export const SWATCHES: Record<ZoneId, Swatch[]> = {
  bar: [
    { id: 'cognac', color: '#8a4b22' },
    { id: 'black', color: '#171413' },
    { id: 'oxblood', color: '#5a1a1d' },
    { id: 'cream', color: '#d9c9a8' },
  ],
  booths: [
    { id: 'emerald', color: '#0f4a3a' },
    { id: 'navy', color: '#18264d' },
    { id: 'burgundy', color: '#5c1424' },
    { id: 'mustard', color: '#b88a2a' },
  ],
  lounge: [
    { id: 'ivory', color: '#e6dfd0' },
    { id: 'terracotta', color: '#9b4b2e' },
    { id: 'stone', color: '#6f6a63' },
    { id: 'camel', color: '#a8784a' },
  ],
  wine: [
    { id: 'chocolate', color: '#3d2416' },
    { id: 'olive', color: '#4a5032' },
    { id: 'smoke', color: '#3b3b3f' },
    { id: 'blush', color: '#b88d86' },
  ],
};

// Paradas de la cámara: posición y punto al que mira. El scroll recorre estas paradas en orden.
const STOPS: { pos: [number, number, number]; look: [number, number, number] }[] = [
  { pos: [0, 1.75, 10], look: [0, 2.1, 0] }, // 0 fachada
  { pos: [0, 1.65, 1.2], look: [0, 1.5, -6] }, // 1 entrando
  { pos: [1.2, 1.65, -5.2], look: [-3.8, 1.0, -8.2] }, // 2 barra
  { pos: [-0.6, 1.6, -11.5], look: [4.0, 0.85, -14.6] }, // 3 booths
  { pos: [1.6, 1.85, -17.2], look: [-1.0, 0.6, -21.6] }, // 4 lounge
  { pos: [0, 1.7, -21.2], look: [0, 1.5, -29] }, // 5 cava / comedor privado
  { pos: [0, 2.3, -23.5], look: [0, 1.3, -29.5] }, // 6 cierre
];
export const STOP_COUNT = STOPS.length;

const isMobile = () => matchMedia('(max-width: 768px)').matches;

/* ---------------- texturas procedurales ---------------- */

function canvasTex(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void, repeat?: [number, number], srgb = true) {
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  draw(cv.getContext('2d')!);
  const t = new THREE.CanvasTexture(cv);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(...repeat);
  }
  return t;
}

function rnd(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

function marble(base: string, vein: string, seed = 7, repeat: [number, number] = [1, 1]) {
  return canvasTex(
    1024,
    1024,
    (c) => {
      const r = rnd(seed);
      c.fillStyle = base;
      c.fillRect(0, 0, 1024, 1024);
      for (let i = 0; i < 26; i++) {
        c.strokeStyle = vein;
        c.globalAlpha = 0.08 + r() * 0.35;
        c.lineWidth = 0.6 + r() * 2.6;
        c.filter = `blur(${r() * 1.6}px)`;
        c.beginPath();
        let x = r() * 1024,
          y = r() * 1024;
        c.moveTo(x, y);
        for (let k = 0; k < 7; k++) {
          x += (r() - 0.3) * 260;
          y += (r() - 0.5) * 220;
          c.quadraticCurveTo(x + (r() - 0.5) * 120, y + (r() - 0.5) * 120, x, y);
        }
        c.stroke();
      }
      c.filter = 'none';
      c.globalAlpha = 1;
    },
    repeat
  );
}

function wood(base: string, grain: string, repeat: [number, number], vertical = false) {
  return canvasTex(
    512,
    512,
    (c) => {
      const r = rnd(11);
      c.fillStyle = base;
      c.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 140; i++) {
        c.strokeStyle = grain;
        c.globalAlpha = 0.05 + r() * 0.18;
        c.lineWidth = 0.5 + r() * 2;
        const p = r() * 512;
        c.beginPath();
        if (vertical) {
          c.moveTo(p, 0);
          c.bezierCurveTo(p + 6, 170, p - 6, 340, p + 3, 512);
        } else {
          c.moveTo(0, p);
          c.bezierCurveTo(170, p + 6, 340, p - 6, 512, p + 3);
        }
        c.stroke();
      }
      c.globalAlpha = 1;
    },
    repeat
  );
}

// Piso en espiga de madera oscura.
function herringbone() {
  return canvasTex(
    1024,
    1024,
    (c) => {
      const r = rnd(5);
      c.fillStyle = '#1b120c';
      c.fillRect(0, 0, 1024, 1024);
      const L = 128,
        W = 32;
      for (let y = -2; y < 20; y++)
        for (let x = -2; x < 20; x++) {
          for (const dir of [0, 1]) {
            c.save();
            c.translate(x * W * 2 + (dir ? W : 0), y * W * 2 + (dir ? 0 : W) + x * W * 2);
            c.rotate(dir ? Math.PI / 4 : -Math.PI / 4);
            const l = 18 + r() * 18;
            c.fillStyle = `rgb(${l + 22},${l + 8},${l - 4})`;
            c.fillRect(0, 0, L, W - 2);
            c.restore();
          }
        }
    },
    [3, 8]
  );
}

// Capitoné (botones en rombo) como mapa de relieve.
function tuftBump(cols: number, rows: number) {
  return canvasTex(
    512,
    512,
    (c) => {
      c.fillStyle = '#fff';
      c.fillRect(0, 0, 512, 512);
      const sx = 512 / cols,
        sy = 512 / rows;
      for (let j = 0; j <= rows * 2; j++)
        for (let i = 0; i <= cols; i++) {
          const x = i * sx + (j % 2 ? sx / 2 : 0),
            y = (j * sy) / 2;
          const g = c.createRadialGradient(x, y, 1, x, y, sx * 0.55);
          g.addColorStop(0, '#000');
          g.addColorStop(0.25, '#555');
          g.addColorStop(1, 'rgba(255,255,255,0)');
          c.fillStyle = g;
          c.beginPath();
          c.arc(x, y, sx * 0.6, 0, Math.PI * 2);
          c.fill();
        }
    },
    undefined,
    false
  );
}

// Canales verticales (channel tufting) como relieve.
function channelBump(n: number) {
  return canvasTex(
    512,
    64,
    (c) => {
      const w = 512 / n;
      for (let i = 0; i < n; i++) {
        const g = c.createLinearGradient(i * w, 0, (i + 1) * w, 0);
        g.addColorStop(0, '#222');
        g.addColorStop(0.5, '#fff');
        g.addColorStop(1, '#222');
        c.fillStyle = g;
        c.fillRect(i * w, 0, w, 64);
      }
    },
    undefined,
    false
  );
}

function labelTex(text: string, opts: { font?: string; color?: string; w?: number; h?: number; bg?: string; spacing?: number } = {}) {
  const w = opts.w ?? 1024,
    h = opts.h ?? 256;
  return canvasTex(w, h, (c) => {
    if (opts.bg) {
      c.fillStyle = opts.bg;
      c.fillRect(0, 0, w, h);
    }
    c.fillStyle = opts.color ?? '#C9A962';
    c.font = opts.font ?? `200 ${h * 0.5}px Outfit, Arial, sans-serif`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    // espaciado entre letras manual (letterSpacing no está en todos los navegadores)
    const sp = opts.spacing ?? h * 0.12;
    const chars = [...text];
    const total = chars.reduce((s, ch) => s + c.measureText(ch).width + sp, -sp);
    let x = w / 2 - total / 2;
    c.textAlign = 'left';
    for (const ch of chars) {
      c.fillText(ch, x, h / 2);
      x += c.measureText(ch).width + sp;
    }
  });
}

/* ---------------- escena ---------------- */

export interface Showroom {
  setProgress(p: number): void;
  setSwatch(zone: ZoneId, index: number): void;
  setVisible(v: boolean): void;
  dispose(): void;
}

export function createShowroom(canvas: HTMLCanvasElement, opts: { images: string[]; labels: Record<ZoneId, string> }): Showroom {
  const mobile = isMobile();
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#070605');
  scene.fog = new THREE.Fog('#070605', 14, 46);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.35;

  const camera = new THREE.PerspectiveCamera(mobile ? 62 : 50, 1, 0.05, 80);

  const disposables: { dispose(): void }[] = [];
  const keep = <T extends { dispose(): void }>(x: T) => (disposables.push(x), x);

  /* ---- materiales ---- */
  const gold = keep(new THREE.MeshStandardMaterial({ color: '#c9a962', metalness: 1, roughness: 0.28 }));
  const brassDark = keep(new THREE.MeshStandardMaterial({ color: '#8c6b32', metalness: 1, roughness: 0.4 }));
  const blackLacquer = keep(new THREE.MeshPhysicalMaterial({ color: '#0d0c0b', roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.1 }));
  const walnut = keep(new THREE.MeshStandardMaterial({ map: keep(wood('#3a2416', '#120a05', [2, 1])), roughness: 0.55 }));
  const panelWood = keep(new THREE.MeshStandardMaterial({ map: keep(wood('#24170f', '#0b0704', [6, 1], true)), roughness: 0.6 }));
  const marbleTop = keep(new THREE.MeshPhysicalMaterial({ map: keep(marble('#ece8e1', '#6f6a60', 3, [2, 1])), roughness: 0.12, clearcoat: 0.6 }));
  const marbleNero = keep(new THREE.MeshPhysicalMaterial({ map: keep(marble('#0f0f10', '#d8d3c7', 9, [1, 1])), roughness: 0.15, clearcoat: 0.8 }));
  const floor = keep(new THREE.MeshStandardMaterial({ map: keep(herringbone()), roughness: 0.38, metalness: 0.05 }));
  const ceiling = keep(new THREE.MeshStandardMaterial({ color: '#0c0a08', roughness: 0.9 }));
  const wallPlaster = keep(new THREE.MeshStandardMaterial({ color: '#1b1612', roughness: 0.92 }));

  const tuft = keep(tuftBump(8, 4));
  const channel = keep(channelBump(9));

  // Tapicería por zona (los colores cambian con las muestras).
  const upholstery: Record<ZoneId, THREE.MeshPhysicalMaterial> = {
    bar: keep(new THREE.MeshPhysicalMaterial({ color: SWATCHES.bar[0].color, roughness: 0.42, clearcoat: 0.35, clearcoatRoughness: 0.4, bumpMap: tuft, bumpScale: 2.2 })),
    booths: keep(new THREE.MeshPhysicalMaterial({ color: SWATCHES.booths[0].color, roughness: 0.85, sheen: 1, sheenRoughness: 0.45, sheenColor: new THREE.Color('#ffffff'), bumpMap: channel, bumpScale: 3 })),
    lounge: keep(new THREE.MeshPhysicalMaterial({ color: SWATCHES.lounge[0].color, roughness: 0.95, sheen: 0.6, sheenRoughness: 0.8 })),
    wine: keep(new THREE.MeshPhysicalMaterial({ color: SWATCHES.wine[0].color, roughness: 0.45, clearcoat: 0.3 })),
  };
  const barFront = keep(new THREE.MeshPhysicalMaterial({ color: SWATCHES.bar[0].color, roughness: 0.42, clearcoat: 0.35, bumpMap: keep(tuftBump(24, 3)), bumpScale: 2.5 }));
  const targetColor: Record<ZoneId, THREE.Color> = {
    bar: new THREE.Color(SWATCHES.bar[0].color),
    booths: new THREE.Color(SWATCHES.booths[0].color),
    lounge: new THREE.Color(SWATCHES.lounge[0].color),
    wine: new THREE.Color(SWATCHES.wine[0].color),
  };

  const geo = <G extends THREE.BufferGeometry>(g: G) => keep(g);
  const mesh = (g: THREE.BufferGeometry, m: THREE.Material, x = 0, y = 0, z = 0, parent: THREE.Object3D = scene) => {
    const o = new THREE.Mesh(g, m);
    o.position.set(x, y, z);
    parent.add(o);
    return o;
  };
  const rbox = (w: number, h: number, d: number, r = 0.05) => geo(new RoundedBoxGeometry(w, h, d, 3, r));

  /* ---- sala ---- */
  const W = 12,
    H = 4.2,
    Z0 = 0,
    Z1 = -30;
  const L = Z0 - Z1;
  const floorM = mesh(geo(new THREE.PlaneGeometry(W, L)), floor, 0, 0, (Z0 + Z1) / 2);
  floorM.rotation.x = -Math.PI / 2;
  const ceil = mesh(geo(new THREE.PlaneGeometry(W, L)), ceiling, 0, H, (Z0 + Z1) / 2);
  ceil.rotation.x = Math.PI / 2;
  // paredes laterales con listones de madera y zócalo de latón
  for (const s of [-1, 1]) {
    const wall = mesh(geo(new THREE.PlaneGeometry(L, H)), panelWood, (s * W) / 2, H / 2, (Z0 + Z1) / 2);
    wall.rotation.y = -s * (Math.PI / 2);
    mesh(geo(new THREE.BoxGeometry(0.02, 0.03, L)), gold, s * (W / 2 - 0.02), 1.0, (Z0 + Z1) / 2);
    mesh(geo(new THREE.BoxGeometry(0.02, 0.03, L)), gold, s * (W / 2 - 0.02), 3.2, (Z0 + Z1) / 2);
  }
  const back = mesh(geo(new THREE.PlaneGeometry(W, H)), wallPlaster, 0, H / 2, Z1);
  back.name = 'back';
  // fachada (pared con puerta)
  const facadeMat = panelWood;
  const doorW = 2.2,
    doorH = 2.8;
  for (const s of [-1, 1]) {
    const w = (W - doorW) / 2;
    mesh(geo(new THREE.BoxGeometry(w, H, 0.2)), facadeMat, s * (doorW / 2 + w / 2), H / 2, Z0);
  }
  mesh(geo(new THREE.BoxGeometry(doorW, H - doorH, 0.2)), facadeMat, 0, doorH + (H - doorH) / 2, Z0);
  // marco dorado de la puerta
  mesh(geo(new THREE.BoxGeometry(doorW + 0.24, 0.12, 0.3)), gold, 0, doorH + 0.06, Z0);
  for (const s of [-1, 1]) mesh(geo(new THREE.BoxGeometry(0.12, doorH, 0.3)), gold, s * (doorW / 2 + 0.06), doorH / 2, Z0);
  // puertas (giran al entrar)
  const doors: THREE.Group[] = [];
  for (const s of [-1, 1]) {
    const pivot = new THREE.Group();
    pivot.position.set(s * (doorW / 2), 0, Z0 + 0.02);
    const leaf = mesh(geo(new THREE.BoxGeometry(doorW / 2 - 0.02, doorH - 0.04, 0.06)), blackLacquer, -s * (doorW / 4), doorH / 2, 0, pivot);
    mesh(geo(new THREE.CylinderGeometry(0.018, 0.018, 0.9, 12)), gold, -s * (doorW / 2 - 0.16), 0, 0.07, leaf);
    scene.add(pivot);
    pivot.userData.side = s;
    doors.push(pivot);
  }
  // letrero de la fachada
  const sign = keep(new THREE.MeshBasicMaterial({ map: keep(labelTex('ATELIER')), transparent: true, toneMapped: false }));
  mesh(geo(new THREE.PlaneGeometry(4.2, 1.05)), sign, 0, 3.55, Z0 + 0.12);
  const sub = keep(new THREE.MeshBasicMaterial({ map: keep(labelTex('BAR · SHOWROOM', { h: 128, w: 1024, color: '#E8D5A3' })), transparent: true, toneMapped: false }));
  mesh(geo(new THREE.PlaneGeometry(2.6, 0.32)), sub, 0, 3.05, Z0 + 0.12);
  // apliques de luz a los lados de la puerta
  const glow = keep(new THREE.MeshBasicMaterial({ color: '#ffd9a0', toneMapped: false }));
  for (const s of [-1, 1]) {
    mesh(geo(new THREE.BoxGeometry(0.08, 0.9, 0.08)), glow, s * 1.9, 2.0, Z0 + 0.16);
    mesh(geo(new THREE.BoxGeometry(0.14, 1.0, 0.04)), gold, s * 1.9, 2.0, Z0 + 0.11);
  }
  // macetas en la fachada
  const plantMat = keep(new THREE.MeshStandardMaterial({ color: '#1f3a24', roughness: 0.8 }));
  for (const s of [-1, 1]) {
    mesh(geo(new THREE.CylinderGeometry(0.35, 0.28, 0.8, 24)), blackLacquer, s * 3.2, 0.4, Z0 + 0.7);
    const bush = mesh(geo(new THREE.IcosahedronGeometry(0.55, 1)), plantMat, s * 3.2, 1.2, Z0 + 0.7);
    bush.scale.set(1, 1.3, 1);
  }
  // exterior: piso de piedra delante de la fachada
  const street = mesh(geo(new THREE.PlaneGeometry(30, 14)), keep(new THREE.MeshStandardMaterial({ color: '#141210', roughness: 0.7 })), 0, -0.001, 7);
  street.rotation.x = -Math.PI / 2;

  /* ---- zona 1: barra ---- */
  const barX = -3.6,
    barZ0 = -4.0,
    barZ1 = -11.0;
  const barLen = barZ0 - barZ1,
    barCz = (barZ0 + barZ1) / 2;
  mesh(rbox(1.0, 1.05, barLen, 0.03), barFront, barX, 0.55, barCz); // frente capitoné
  mesh(rbox(1.25, 0.07, barLen + 0.2, 0.02), marbleTop, barX + 0.05, 1.12, barCz); // cubierta de mármol
  mesh(geo(new THREE.BoxGeometry(0.03, 0.03, barLen)), gold, barX + 0.55, 0.22, barCz); // reposapiés
  mesh(geo(new THREE.BoxGeometry(0.04, 0.06, barLen + 0.2)), gold, barX + 0.68, 1.08, barCz); // filo dorado
  // contrabarra con estanterías iluminadas y botellas
  const shelfBack = keep(new THREE.MeshBasicMaterial({ color: '#3a2610', toneMapped: false }));
  mesh(geo(new THREE.PlaneGeometry(barLen, 2.2)), shelfBack, -W / 2 + 0.03, 2.1, barCz).rotation.y = Math.PI / 2;
  const bottleMats = ['#2c5e2e', '#6b3a12', '#d9c9a8', '#1c1c3a', '#7a1d1d', '#c9a962'].map((c) =>
    keep(new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.05, transmission: mobile ? 0 : 0.6, thickness: 0.3, transparent: true, opacity: 0.92 }))
  );
  const bottleG = geo(new THREE.CylinderGeometry(0.045, 0.05, 0.3, 12));
  const neckG = geo(new THREE.CylinderGeometry(0.014, 0.03, 0.12, 10));
  const r = rnd(21);
  for (const y of [1.25, 1.9, 2.55]) {
    mesh(geo(new THREE.BoxGeometry(0.32, 0.03, barLen)), marbleNero, -W / 2 + 0.18, y, barCz);
    for (let z = barZ0 - 0.2; z > barZ1 + 0.2; z -= 0.16 + r() * 0.08) {
      const m = bottleMats[Math.floor(r() * bottleMats.length)];
      const b = mesh(bottleG, m, -W / 2 + 0.2, y + 0.165, z);
      mesh(neckG, m, 0, 0.21, 0, b);
    }
  }
  // banquetas de la barra
  const stoolSeat = geo(new THREE.CylinderGeometry(0.22, 0.2, 0.12, 28));
  const stoolBack = rbox(0.42, 0.28, 0.07, 0.03);
  const pole = geo(new THREE.CylinderGeometry(0.025, 0.025, 0.72, 12));
  const baseG = geo(new THREE.CylinderGeometry(0.2, 0.22, 0.03, 28));
  const ringG = geo(new THREE.TorusGeometry(0.17, 0.012, 8, 32));
  for (let i = 0; i < 6; i++) {
    const z = barZ0 - 0.6 - i * 1.1;
    const g = new THREE.Group();
    g.position.set(barX + 1.05, 0, z);
    mesh(baseG, brassDark, 0, 0.015, 0, g);
    mesh(pole, gold, 0, 0.38, 0, g);
    const ring = mesh(ringG, gold, 0, 0.32, 0, g);
    ring.rotation.x = Math.PI / 2;
    mesh(stoolSeat, upholstery.bar, 0, 0.78, 0, g);
    const bk = mesh(stoolBack, upholstery.bar, 0.2, 1.0, 0, g);
    bk.rotation.y = Math.PI / 2;
    scene.add(g);
  }

  /* ---- zona 2: booths curvos en terciopelo ---- */
  const boothSeg = rbox(0.5, 0.18, 0.6, 0.06);
  const boothBack = rbox(0.5, 0.75, 0.16, 0.06);
  const tableTop = geo(new THREE.CylinderGeometry(0.55, 0.55, 0.05, 40));
  const tableStem = geo(new THREE.CylinderGeometry(0.05, 0.05, 0.7, 16));
  for (const cz of [-12.6, -15.6]) {
    const center = new THREE.Vector3(4.1, 0, cz);
    const R = 1.25;
    const n = 9;
    for (let i = 0; i < n; i++) {
      const a = -Math.PI * 0.85 + (i / (n - 1)) * Math.PI * 0.7; // arco abierto hacia el pasillo (-x)
      const ang = a + Math.PI; // gira el arco para que mire al pasillo
      const x = center.x + Math.cos(ang) * -R,
        z = center.z + Math.sin(ang) * -R;
      const seat = mesh(boothSeg, upholstery.booths, x, 0.48, z);
      seat.lookAt(center.x, 0.48, center.z);
      const bx = center.x + Math.cos(ang) * -(R + 0.32),
        bz = center.z + Math.sin(ang) * -(R + 0.32);
      const bk = mesh(boothBack, upholstery.booths, bx, 0.95, bz);
      bk.lookAt(center.x, 0.95, center.z);
      const plinth = mesh(rbox(0.5, 0.38, 0.62, 0.02), walnut, x, 0.19, z);
      plinth.lookAt(center.x, 0.19, center.z);
    }
    mesh(tableTop, marbleNero, center.x - 0.15, 0.74, center.z);
    mesh(tableStem, gold, center.x - 0.15, 0.37, center.z);
    mesh(baseG, gold, center.x - 0.15, 0.02, center.z);
    // vela/lámpara de mesa
    mesh(geo(new THREE.CylinderGeometry(0.05, 0.06, 0.16, 16)), glow, center.x - 0.15, 0.85, center.z);
  }

  /* ---- zona 3: lounge ---- */
  const loungeC = new THREE.Vector3(-1.2, 0, -21.4);
  const rug = mesh(geo(new THREE.CircleGeometry(2.4, 48)), keep(new THREE.MeshStandardMaterial({ color: '#2a2219', roughness: 1 })), loungeC.x, 0.005, loungeC.z);
  rug.rotation.x = -Math.PI / 2;
  // sofá
  const sofa = new THREE.Group();
  sofa.position.set(loungeC.x - 1.6, 0, loungeC.z);
  sofa.rotation.y = Math.PI / 2;
  mesh(rbox(2.4, 0.42, 0.95, 0.12), upholstery.lounge, 0, 0.3, 0, sofa);
  mesh(rbox(2.4, 0.6, 0.25, 0.12), upholstery.lounge, 0, 0.75, -0.38, sofa);
  for (const s of [-1, 1]) mesh(rbox(0.25, 0.55, 0.95, 0.12), upholstery.lounge, s * 1.2, 0.45, 0, sofa);
  for (const s of [-1, 0, 1]) mesh(rbox(0.75, 0.14, 0.7, 0.07), upholstery.lounge, s * 0.76, 0.57, 0.08, sofa);
  for (const sx of [-1.05, 1.05]) for (const sz of [-0.35, 0.35]) mesh(geo(new THREE.CylinderGeometry(0.025, 0.02, 0.1, 10)), gold, sx, 0.05, sz, sofa);
  scene.add(sofa);
  // butacas
  for (const s of [-1, 1]) {
    const a = new THREE.Group();
    a.position.set(loungeC.x + 1.1, 0, loungeC.z + s * 1.1);
    a.rotation.y = -Math.PI / 2 + s * 0.45;
    mesh(rbox(0.85, 0.4, 0.8, 0.12), upholstery.lounge, 0, 0.32, 0, a);
    const bk = mesh(rbox(0.85, 0.55, 0.2, 0.1), upholstery.lounge, 0, 0.72, -0.32, a);
    bk.rotation.x = -0.12;
    for (const x of [-0.43, 0.43]) mesh(rbox(0.14, 0.45, 0.8, 0.07), upholstery.lounge, x, 0.48, 0, a);
    mesh(geo(new THREE.CylinderGeometry(0.3, 0.3, 0.02, 24)), gold, 0, 0.08, 0, a);
    scene.add(a);
  }
  // mesa de centro
  mesh(geo(new THREE.CylinderGeometry(0.6, 0.6, 0.06, 40)), marbleTop, loungeC.x, 0.42, loungeC.z);
  mesh(geo(new THREE.CylinderGeometry(0.45, 0.5, 0.36, 40)), brassDark, loungeC.x, 0.2, loungeC.z);

  /* ---- zona 4: cava y comedor privado ---- */
  // pared de vinos retroiluminada
  const cavaGlow = keep(new THREE.MeshBasicMaterial({ color: '#5a3a15', toneMapped: false }));
  mesh(geo(new THREE.PlaneGeometry(7, 3.2)), cavaGlow, 0, 1.9, Z1 + 0.02);
  const wineG = geo(new THREE.CylinderGeometry(0.035, 0.035, 0.28, 10));
  const wineMat = keep(new THREE.MeshStandardMaterial({ color: '#1a0b0b', roughness: 0.2, metalness: 0.2 }));
  for (let row = 0; row < 9; row++) {
    const y = 0.55 + row * 0.33;
    mesh(geo(new THREE.BoxGeometry(7, 0.02, 0.3)), walnut, 0, y - 0.05, Z1 + 0.16);
    for (let x = -3.3; x <= 3.3; x += 0.11) {
      const b = mesh(wineG, wineMat, x, y + 0.04, Z1 + 0.16);
      b.rotation.x = Math.PI / 2;
    }
  }
  for (const s of [-1, 1]) mesh(geo(new THREE.BoxGeometry(0.14, 3.4, 0.4)), gold, s * 3.6, 1.9, Z1 + 0.2);
  // mesa del comedor privado
  const dZ = -26.2;
  mesh(rbox(3.2, 0.07, 1.2, 0.03), marbleTop, 0, 0.76, dZ);
  for (const s of [-1, 1]) mesh(geo(new THREE.BoxGeometry(0.12, 0.72, 0.9)), brassDark, s * 1.2, 0.37, dZ);
  for (let i = 0; i < 6; i++) {
    const side = i < 3 ? -1 : 1;
    const x = -1.05 + (i % 3) * 1.05;
    const c = new THREE.Group();
    c.position.set(x, 0, dZ + side * 0.95);
    c.rotation.y = side < 0 ? 0 : Math.PI;
    mesh(rbox(0.5, 0.12, 0.5, 0.05), upholstery.wine, 0, 0.48, 0, c);
    const bk = mesh(rbox(0.5, 0.55, 0.08, 0.05), upholstery.wine, 0, 0.82, -0.24, c);
    bk.rotation.x = -0.08;
    for (const lx of [-0.21, 0.21]) for (const lz of [-0.21, 0.21]) mesh(geo(new THREE.CylinderGeometry(0.018, 0.014, 0.44, 8)), gold, lx, 0.22, lz, c);
    scene.add(c);
  }

  /* ---- cuadros con proyectos reales en las paredes ---- */
  const loader = new THREE.TextureLoader();
  const framePos: [number, number, number, number][] = [
    [W / 2 - 0.04, 2.15, -5.2, -Math.PI / 2],
    [W / 2 - 0.04, 2.15, -8.4, -Math.PI / 2],
    [-W / 2 + 0.04, 2.15, -14.2, Math.PI / 2],
    [-W / 2 + 0.04, 2.15, -17.4, Math.PI / 2],
    [W / 2 - 0.04, 2.15, -19.8, -Math.PI / 2],
    [W / 2 - 0.04, 2.15, -23.0, -Math.PI / 2],
  ];
  opts.images.slice(0, framePos.length).forEach((src, i) => {
    const [x, y, z, ry] = framePos[i];
    const g = new THREE.Group();
    g.position.set(x, y, z);
    g.rotation.y = ry;
    mesh(geo(new THREE.BoxGeometry(1.9, 1.32, 0.05)), gold, 0, 0, 0, g);
    const tex = keep(loader.load(src));
    tex.colorSpace = THREE.SRGBColorSpace;
    mesh(geo(new THREE.PlaneGeometry(1.78, 1.2)), keep(new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, color: '#d8d0c4' })), 0, 0, 0.03, g);
    mesh(geo(new THREE.BoxGeometry(1.1, 0.02, 0.06)), glow, 0, 0.82, 0.12, g); // luz de cuadro
    scene.add(g);
  });

  /* ---- rótulos de zona en las paredes ---- */
  const zoneSign = (text: string, x: number, z: number, ry: number) => {
    const m = keep(new THREE.MeshBasicMaterial({ map: keep(labelTex(text.toUpperCase(), { h: 128, w: 1024 })), transparent: true, toneMapped: false }));
    const p = mesh(geo(new THREE.PlaneGeometry(2.6, 0.32)), m, x, 3.55, z);
    p.rotation.y = ry;
  };
  zoneSign(opts.labels.bar, -W / 2 + 0.05, -7.5, Math.PI / 2);
  zoneSign(opts.labels.booths, W / 2 - 0.05, -14.1, -Math.PI / 2);
  zoneSign(opts.labels.lounge, -W / 2 + 0.05, -21.4, Math.PI / 2);
  zoneSign(opts.labels.wine, 0, Z1 + 0.05, 0);

  /* ---- luces ---- */
  scene.add(new THREE.HemisphereLight('#f3d9a8', '#120c06', 0.25));
  const pendantG = geo(new THREE.SphereGeometry(0.11, 20, 16));
  const pendantShade = geo(new THREE.CylinderGeometry(0.06, 0.2, 0.22, 24, 1, true));
  const cordG = geo(new THREE.CylinderGeometry(0.005, 0.005, 1, 6));
  const addPendant = (x: number, y: number, z: number, light: boolean, intensity = 6) => {
    mesh(pendantG, glow, x, y, z);
    const sh = mesh(pendantShade, gold, x, y + 0.08, z);
    (sh.material as THREE.Material).side = THREE.DoubleSide;
    const cord = mesh(cordG, blackLacquer, x, (H + y) / 2 + 0.1, z);
    cord.scale.y = H - y - 0.2;
    if (light) {
      const p = new THREE.PointLight('#ffcf8a', intensity, 7, 1.6);
      p.position.set(x, y - 0.15, z);
      scene.add(p);
    }
  };
  // barra
  for (let i = 0; i < 6; i++) addPendant(barX + 0.1, 2.5, barZ0 - 0.6 - i * 1.1, i % 2 === 0);
  // booths
  for (const cz of [-12.6, -15.6]) addPendant(3.95, 1.9, cz, true, 5);
  // lounge: candelabro de anillos
  for (const rr of [0.9, 0.6]) {
    const ring = mesh(geo(new THREE.TorusGeometry(rr, 0.03, 10, 64)), glow, loungeC.x, 3.0 - rr * 0.3, loungeC.z);
    ring.rotation.x = Math.PI / 2;
  }
  const lp = new THREE.PointLight('#ffcf8a', 9, 9, 1.5);
  lp.position.set(loungeC.x, 2.5, loungeC.z);
  scene.add(lp);
  // comedor privado
  for (const x of [-0.9, 0, 0.9]) addPendant(x, 2.2, dZ, x === 0, 7);
  const cavaL = new THREE.PointLight('#ffb866', 6, 8, 1.4);
  cavaL.position.set(0, 2.2, Z1 + 1.2);
  scene.add(cavaL);
  // entrada
  const entry = new THREE.PointLight('#ffd9a0', 10, 10, 1.4);
  entry.position.set(0, 3.2, Z0 + 2.5);
  scene.add(entry);
  const hall = new THREE.PointLight('#ffcf8a', 4, 8, 1.6);
  hall.position.set(0, 3.4, -2.5);
  scene.add(hall);
  // tiras de luz en el techo
  for (const s of [-1, 1]) mesh(geo(new THREE.BoxGeometry(0.06, 0.02, L - 1)), glow, s * 2.6, H - 0.02, (Z0 + Z1) / 2);

  /* ---- partículas doradas (polvo en la luz) ---- */
  const N = mobile ? 250 : 600;
  const pts = new Float32Array(N * 3);
  const pr = rnd(99);
  for (let i = 0; i < N; i++) {
    pts[i * 3] = (pr() - 0.5) * W;
    pts[i * 3 + 1] = pr() * H;
    pts[i * 3 + 2] = Z0 + 6 - pr() * (L + 6);
  }
  const dustG = geo(new THREE.BufferGeometry());
  dustG.setAttribute('position', new THREE.BufferAttribute(pts, 3));
  const dust = new THREE.Points(dustG, keep(new THREE.PointsMaterial({ color: '#e8c987', size: 0.025, transparent: true, opacity: 0.55, depthWrite: false })));
  scene.add(dust);

  /* ---- cámara: scroll + mirar alrededor ---- */
  const tPos = new THREE.Vector3(...STOPS[0].pos);
  const tLook = new THREE.Vector3(...STOPS[0].look);
  const cPos = tPos.clone();
  const cLook = tLook.clone();
  camera.position.copy(cPos);
  let progress = 0;
  let yaw = 0,
    pitch = 0,
    tYaw = 0,
    tPitch = 0;
  let dragging = false,
    lastX = 0,
    lastY = 0,
    lastStop = -1;
  const ease = (x: number) => x * x * (3 - 2 * x);

  function applyProgress() {
    const f = progress * (STOPS.length - 1);
    const i = Math.min(STOPS.length - 2, Math.floor(f));
    const k = ease(Math.min(1, Math.max(0, f - i)));
    const a = STOPS[i],
      b = STOPS[i + 1];
    tPos.set(...a.pos).lerp(new THREE.Vector3(...b.pos), k);
    tLook.set(...a.look).lerp(new THREE.Vector3(...b.look), k);
    // al llegar a otra parada, la vista vuelve al frente
    const stop = Math.round(f);
    if (stop !== lastStop && !dragging) {
      tYaw = 0;
      tPitch = 0;
    }
    lastStop = stop;
    // puertas: se abren entre la fachada y la entrada
    const open = ease(Math.min(1, Math.max(0, f / 0.8)));
    // la hoja izquierda gira con ángulo positivo y la derecha con negativo: las dos abren hacia adentro
    for (const d of doors) d.rotation.y = -d.userData.side * open * 1.6;
  }

  const onDown = (e: PointerEvent) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = 'grabbing';
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    tYaw += (e.clientX - lastX) * 0.006;
    tPitch = Math.max(-0.6, Math.min(0.6, tPitch + (e.clientY - lastY) * 0.004));
    lastX = e.clientX;
    lastY = e.clientY;
  };
  const onUp = () => {
    dragging = false;
    canvas.style.cursor = 'grab';
  };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);
  canvas.style.cursor = 'grab';
  canvas.style.touchAction = 'pan-y'; // en celular: arrastrar en horizontal mira, en vertical hace scroll

  function resize() {
    const w = canvas.clientWidth,
      h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dir = new THREE.Vector3();
  const look = new THREE.Vector3();
  const clock = new THREE.Clock();
  let visible = true;

  renderer.setAnimationLoop(() => {
    if (!visible) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const k = reduce ? 1 : 1 - Math.pow(0.0015, dt);
    cPos.lerp(tPos, k);
    cLook.lerp(tLook, k);
    yaw += (tYaw - yaw) * (reduce ? 1 : 1 - Math.pow(0.002, dt));
    pitch += (tPitch - pitch) * (reduce ? 1 : 1 - Math.pow(0.002, dt));
    camera.position.copy(cPos);
    // dirección base hacia el punto de interés, girada por el arrastre (360°)
    dir.subVectors(cLook, cPos).normalize();
    const baseYaw = Math.atan2(dir.x, dir.z);
    const basePitch = Math.asin(THREE.MathUtils.clamp(dir.y, -1, 1));
    const yy = baseYaw - yaw,
      pp = THREE.MathUtils.clamp(basePitch - pitch, -1.2, 1.2);
    look.set(Math.sin(yy) * Math.cos(pp), Math.sin(pp), Math.cos(yy) * Math.cos(pp)).add(cPos);
    camera.lookAt(look);
    // colores de tapicería con transición suave
    (Object.keys(upholstery) as ZoneId[]).forEach((z) => upholstery[z].color.lerp(targetColor[z], 0.08));
    barFront.color.lerp(targetColor.bar, 0.08);
    if (!reduce) dust.rotation.y += dt * 0.004;
    renderer.render(scene, camera);
  });

  return {
    setProgress(p) {
      progress = Math.min(1, Math.max(0, p));
      applyProgress();
    },
    setSwatch(zone, index) {
      const s = SWATCHES[zone][index];
      if (s) targetColor[zone].set(s.color);
    },
    setVisible(v) {
      visible = v;
      if (v) clock.getDelta();
    },
    dispose() {
      renderer.setAnimationLoop(null);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      disposables.forEach((d) => d.dispose());
      scene.environment?.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
