import { Delaunay } from "d3-delaunay";
import { NATIONS } from "./nations";

export const MAP_WIDTH = 1600;
export const MAP_HEIGHT = 900;

type Pt = [number, number];

function organicPoints(
  cx: number,
  cy: number,
  baseR: number,
  seed: number,
  count: number,
  bay?: { angle: number; width: number; depth: number },
  squash?: { x: number; y: number },
): Pt[] {
  const sx = squash?.x ?? 1;
  const sy = squash?.y ?? 1;
  const pts: Pt[] = [];
  for (let i = 0; i < count; i++) {
    const aDeg = (i / count) * 360 - 180;
    const a = (aDeg * Math.PI) / 180;
    let n =
      Math.sin(a * 2 + seed * 1.1) * 0.10 +
      Math.sin(a * 3 + seed * 1.7) * 0.07 +
      Math.cos(a * 5 + seed * 2.3) * 0.05 +
      Math.sin(a * 7 + seed * 0.9) * 0.03;

    if (bay) {
      const angleDist = Math.abs(((aDeg - bay.angle + 540) % 360) - 180);
      if (angleDist < bay.width / 2) {
        const t = 1 - angleDist / (bay.width / 2);
        const ease = Math.cos((t * Math.PI) / 2);
        n -= bay.depth * (1 - ease);
      }
    }

    const r = baseR * (1 + n);
    pts.push([cx + r * sx * Math.cos(a), cy + r * sy * Math.sin(a)]);
  }
  return pts;
}

function catmullRomPath(pts: Pt[]): string {
  const n = pts.length;
  if (n < 3) return "";
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)} `;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)} ${cp2x.toFixed(1)} ${cp2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)} `;
  }
  return d + "Z";
}

function continent(
  cx: number,
  cy: number,
  baseR: number,
  seed: number,
  opts?: {
    bay?: { angle: number; width: number; depth: number };
    squash?: { x: number; y: number };
    count?: number;
  },
): string {
  const pts = organicPoints(
    cx,
    cy,
    baseR,
    seed,
    opts?.count ?? 22,
    opts?.bay,
    opts?.squash,
  );
  return catmullRomPath(pts);
}

function islandShape(cx: number, cy: number, r: number, seed: number): string {
  const pts = organicPoints(cx, cy, r, seed, 10);
  return catmullRomPath(pts);
}

const AUR_MAIN = continent(450, 270, 160, 1.7, {
  bay: { angle: 130, width: 80, depth: 0.28 },
  squash: { x: 1.05, y: 0.92 },
});
const AUR_ISLANDS =
  islandShape(595, 360, 22, 3.1) + " " + islandShape(640, 405, 14, 5.8);

const BOR_MAIN = continent(1130, 250, 185, 4.2, {
  bay: { angle: -160, width: 70, depth: 0.32 },
  squash: { x: 1.1, y: 0.85 },
});
const BOR_ISLANDS =
  islandShape(880, 140, 20, 2.4) +
  " " +
  islandShape(930, 175, 14, 7.1) +
  " " +
  islandShape(1360, 370, 18, 6.3);

const CAS_MAIN = continent(450, 700, 150, 2.9, {
  bay: { angle: -45, width: 90, depth: 0.3 },
  squash: { x: 0.95, y: 1.0 },
});
const CAS_ISLANDS =
  islandShape(255, 670, 20, 1.5) +
  " " +
  islandShape(270, 820, 14, 5.2) +
  " " +
  islandShape(620, 800, 18, 8.7);

const DEL_MAIN = continent(1170, 700, 175, 5.6, {
  bay: { angle: 180, width: 80, depth: 0.32 },
  squash: { x: 1.05, y: 0.9 },
});
const DEL_ISLANDS =
  islandShape(1410, 790, 18, 0.7) +
  " " +
  islandShape(1370, 530, 14, 4.4) +
  " " +
  islandShape(990, 830, 16, 9.2);

const ELY_MAIN = continent(800, 480, 130, 3.6, {
  squash: { x: 1.15, y: 0.85 },
  count: 20,
});
const ELY_ISLANDS = [
  islandShape(625, 400, 18, 0.4),
  islandShape(990, 420, 20, 6.6),
  islandShape(990, 580, 14, 2.2),
  islandShape(620, 560, 14, 8.1),
  islandShape(810, 630, 12, 4.9),
].join(" ");

export type Continent = {
  code: string;
  d: string;
  mainD: string;
  center: { x: number; y: number };
};

export const CONTINENTS: Continent[] = [
  {
    code: "CLD",
    d: AUR_MAIN + " " + AUR_ISLANDS,
    mainD: AUR_MAIN,
    center: { x: 450, y: 270 },
  },
  {
    code: "GPT",
    d: BOR_MAIN + " " + BOR_ISLANDS,
    mainD: BOR_MAIN,
    center: { x: 1130, y: 250 },
  },
  {
    code: "GRK",
    d: CAS_MAIN + " " + CAS_ISLANDS,
    mainD: CAS_MAIN,
    center: { x: 450, y: 700 },
  },
  {
    code: "DSK",
    d: DEL_MAIN + " " + DEL_ISLANDS,
    mainD: DEL_MAIN,
    center: { x: 1170, y: 700 },
  },
  {
    code: "GMN",
    d: ELY_MAIN + " " + ELY_ISLANDS,
    mainD: ELY_MAIN,
    center: { x: 800, y: 480 },
  },
];

export const SEA_ROUTES: { id: string; d: string; duration: number }[] = [
  { id: "r1", d: "M 610 250 C 760 200 880 200 980 220", duration: 16 },
  { id: "r2", d: "M 610 380 C 680 420 720 440 740 470", duration: 10 },
  { id: "r3", d: "M 880 470 C 930 510 970 560 1000 640", duration: 13 },
  { id: "r4", d: "M 580 380 C 620 410 670 430 720 460", duration: 11 },
  { id: "r5", d: "M 570 580 C 620 530 680 510 730 510", duration: 11 },
  { id: "r6", d: "M 690 610 C 720 650 770 670 850 690", duration: 12 },
  { id: "r7", d: "M 870 730 C 950 750 1030 740 1080 720", duration: 13 },
  { id: "r8", d: "M 1010 370 C 1050 470 1080 570 1100 640", duration: 15 },
  { id: "r9", d: "M 320 470 C 350 540 380 600 410 660", duration: 12 },
];

export type ProvinceCell = {
  cityName: string;
  d: string;
};

export function provincesFor(code: string): ProvinceCell[] {
  const nation = NATIONS.find((n) => n.code === code);
  if (!nation) return [];
  const points: [number, number][] = nation.cities.map((c) => [c.x, c.y]);
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const bbox: [number, number, number, number] = [
    Math.min(...xs) - 280,
    Math.min(...ys) - 280,
    Math.max(...xs) + 280,
    Math.max(...ys) + 280,
  ];
  const delaunay = Delaunay.from(points);
  const voronoi = delaunay.voronoi(bbox);
  return nation.cities.map((city, i) => {
    const poly = voronoi.cellPolygon(i);
    if (!poly) return { cityName: city.name, d: "" };
    const d =
      "M " +
      poly
        .map((p) => `${(p[0] as number).toFixed(1)} ${(p[1] as number).toFixed(1)}`)
        .join(" L ") +
      " Z";
    return { cityName: city.name, d };
  });
}

export const CABLE_ARCS: { id: string; d: string; delay: number }[] = [
  { id: "c1", d: "M 440 260 Q 780 110 1125 235", delay: 0 },
  { id: "c2", d: "M 445 705 Q 600 780 800 480", delay: 2.6 },
  { id: "c3", d: "M 800 480 Q 980 580 1175 695", delay: 5.2 },
  { id: "c4", d: "M 1125 235 Q 1280 470 1175 695", delay: 7.8 },
  { id: "c5", d: "M 440 260 Q 360 480 445 705", delay: 10.4 },
  { id: "c6", d: "M 800 480 Q 640 360 440 260", delay: 13.0 },
  { id: "c7", d: "M 800 480 Q 940 360 1125 235", delay: 15.6 },
];
