import { Candle, Drop } from "./Chandelier";
import { f, Garland, Leaf, Rose } from "./Florals";

// Velvet fold gradient: alternating shadow / body / sheen bands.
function foldStops(folds: number, seed: number) {
  const stops: { o: number; c: string }[] = [];
  let s = seed;
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < folds; i++) {
    const base = i / folds;
    const w = 1 / folds;
    const j = (r() - 0.5) * w * 0.3;
    stops.push({ o: base, c: "#7a2b44" });
    stops.push({ o: base + w * 0.3 + j, c: "#b85c77" });
    stops.push({ o: base + w * 0.52 + j, c: r() > 0.5 ? "#f5b8c7" : "#eb9fb3" });
    stops.push({ o: base + w * 0.62 + j, c: "#c9718b" });
    stops.push({ o: base + w * 0.92, c: "#86324c" });
  }
  stops.push({ o: 1, c: "#7a2b44" });
  return stops.map((st, i) => <stop key={i} offset={f(Math.min(1, Math.max(0, st.o)))} stopColor={st.c} />);
}

export function VelvetDefs() {
  return (
    <svg aria-hidden width="0" height="0" style={{ position: "absolute", width: 0, height: 0 }}>
      <defs>
        <linearGradient id="velvetDrape" x1="0" y1="0" x2="1" y2="0">{foldStops(6, 11)}</linearGradient>
        <linearGradient id="velvetSwag" x1="0" y1="0" x2="1" y2="0">{foldStops(9, 23)}</linearGradient>
        <linearGradient id="velvetShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5f1630" stopOpacity=".55" />
          <stop offset=".18" stopColor="#5f1630" stopOpacity="0" />
          <stop offset=".55" stopColor="#ffd0dc" stopOpacity=".08" />
          <stop offset=".8" stopColor="#5f1630" stopOpacity=".1" />
          <stop offset="1" stopColor="#5f1630" stopOpacity=".6" />
        </linearGradient>
        <linearGradient id="swagSheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#86324c" />
          <stop offset=".45" stopColor="#d6849c" />
          <stop offset=".7" stopColor="#f5b8c7" />
          <stop offset="1" stopColor="#8f3a55" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Tied-back side curtain. Stretches to its box; mirror for the right side. */
export function Drape({ className }: { className?: string }) {
  const shape = "M0 0 H128 C 118 180 52 360 42 470 C 40 500 78 640 118 800 H0 Z";
  return (
    <svg className={className} viewBox="0 0 128 800" preserveAspectRatio="none" aria-hidden>
      <path d={shape} fill="url(#velvetDrape)" />
      <path d={shape} fill="url(#velvetShade)" />
      <path d="M128 0 C 118 180 52 360 42 470 C 40 500 78 640 118 800" fill="none" stroke="rgba(255,220,230,.28)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
      <path d="M126 0 C 116 180 50 360 40 470 C 38 500 76 640 116 800" fill="none" stroke="url(#goldV)" strokeWidth="2.4" vectorEffect="non-scaling-stroke" opacity=".85" />
    </svg>
  );
}

/** Gold rope tie-back with tassel, positioned over the drape's waist. */
export function Tassel({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 150" aria-hidden>
      <path d="M0 22 C 20 30 46 28 60 18" stroke="url(#goldH)" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M0 22 C 20 30 46 28 60 18" stroke="#fff0c0" strokeWidth="1" fill="none" strokeDasharray="3 4" opacity=".6" />
      <path d="M58 20 C 60 34 56 42 56 50" stroke="url(#goldV)" strokeWidth="2.5" fill="none" />
      <circle cx="56" cy="56" r="9" fill="url(#goldBall)" />
      <path d="M48 62 Q 56 68 64 62 L 66 72 Q 56 78 46 72 Z" fill="url(#gold)" />
      {Array.from({ length: 13 }, (_, i) => (
        <path key={i} d={`M${46 + i * 1.7} 74 Q ${45 + i * 1.9} 100 ${42 + i * 2.2} 128`} stroke={i % 2 ? "#e6c06a" : "#a87a2a"} strokeWidth="1.4" fill="none" />
      ))}
    </svg>
  );
}

function quadPoint(x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, t: number) {
  const u = 1 - t;
  return [u * u * x0 + 2 * u * t * cx + t * t * x1, u * u * y0 + 2 * u * t * cy + t * t * y1];
}

function Swag({ x0, x1, depth }: { x0: number; x1: number; depth: number }) {
  const mid = (x0 + x1) / 2;
  const top = 16;
  const fringe = Array.from({ length: 26 }, (_, i) => quadPoint(x0, top, mid, top + depth * 2, x1, top, (i + 0.5) / 26));
  return (
    <g>
      <path d={`M${x0} ${top} Q ${mid} ${top + depth * 2} ${x1} ${top} Q ${mid} ${top + depth * 0.9} ${x0} ${top} Z`} fill="url(#swagSheen)" />
      {[0.35, 0.6, 0.82].map((k) => (
        <path key={k} d={`M${x0 + 4} ${top} Q ${mid} ${f(top + depth * 2 * k + depth * 0.3)} ${x1 - 4} ${top}`} fill="none" stroke="rgba(70, 18, 40,.45)" strokeWidth="1.4" />
      ))}
      {[0.48, 0.72].map((k) => (
        <path key={k} d={`M${x0 + 6} ${top} Q ${mid} ${f(top + depth * 2 * k + depth * 0.2)} ${x1 - 6} ${top}`} fill="none" stroke="rgba(255,220,230,.25)" strokeWidth="1" />
      ))}
      <path d={`M${x0} ${top} Q ${mid} ${top + depth * 2} ${x1} ${top}`} fill="none" stroke="url(#goldH)" strokeWidth="2.2" />
      {fringe.map(([x, y], i) => (
        <line key={i} x1={f(x)} y1={f(y)} x2={f(x)} y2={f(y + 7 + (i % 2) * 2)} stroke={i % 2 ? "#e9c674" : "#9c7026"} strokeWidth="1.3" />
      ))}
    </g>
  );
}

function Jabot({ x, h }: { x: number; h: number }) {
  return (
    <g>
      <path d={`M${x - 9} 12 L ${x + 9} 12 L ${x + 6} ${h} Q ${x} ${h + 8} ${x - 6} ${h} Z`} fill="url(#velvetSwag)" />
      <path d={`M${x - 9} 12 L ${x - 6} ${h} Q ${x} ${h + 8} ${x + 6} ${h} L ${x + 9} 12`} fill="none" stroke="url(#goldV)" strokeWidth="1.2" />
      <circle cx={x} cy={h + 8} r="4" fill="url(#goldBall)" />
      {Array.from({ length: 7 }, (_, i) => (
        <line key={i} x1={x - 3 + i} y1={h + 11} x2={x - 4.5 + i * 1.5} y2={h + 26} stroke={i % 2 ? "#e9c674" : "#a07428"} strokeWidth=".9" />
      ))}
    </g>
  );
}

/** Swagged valance with rose garland across the top of the stage. */
export function Valance({ className }: { className?: string }) {
  const swags = [
    [-6, 140],
    [130, 270],
    [260, 406],
  ];
  return (
    <svg className={className} viewBox="0 0 400 130" aria-hidden>
      <rect x="0" y="0" width="400" height="18" fill="url(#velvetSwag)" />
      {swags.map(([a, b], i) => <Swag key={i} x0={a} x1={b} depth={i === 1 ? 30 : 26} />)}
      <Jabot x={8} h={74} />
      <Jabot x={135} h={52} />
      <Jabot x={265} h={52} />
      <Jabot x={392} h={74} />
      <rect x="0" y="12" width="400" height="3" fill="url(#goldH)" />
      {Array.from({ length: 13 }, (_, i) => (
        <g key={i}>
          <Leaf x={i * 33 - 8} y={14} len={18} rot={-110 + (i % 3) * 30} />
          <Leaf x={i * 33 + 10} y={12} len={16} rot={100 - (i % 2) * 40} gold />
          <Rose x={i * 33} y={6} r={i % 2 ? 11 : 14} seed={i + 60} tone={i % 4 === 1 ? "blush" : i % 3 ? "red" : "deep"} />
        </g>
      ))}
    </svg>
  );
}

/** Gilded C-scroll used at the shoulders and feet of the arch. */
export function GoldScroll({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const main = "M10 150 C 10 90 30 40 80 30 C 120 22 150 50 140 80 C 132 104 104 104 100 86 C 97 72 112 66 118 76";
  const sub = "M10 150 C 30 130 60 128 70 110 C 78 96 66 86 58 94 C 53 99 58 106 63 103";
  const tail = "M10 150 C 4 120 -6 104 4 90 C 10 82 20 88 16 96";
  return (
    <svg className={className} style={style} viewBox="-10 10 170 150" aria-hidden>
      {[main, sub, tail].map((d, i) => (
        <g key={i}>
          <path d={d} stroke="#3d2606" strokeWidth={i ? 5 : 7} fill="none" strokeLinecap="round" opacity=".7" />
          <path d={d} stroke="url(#gold)" strokeWidth={i ? 3 : 4.4} fill="none" strokeLinecap="round" />
          <path d={d} stroke="#fff4c8" strokeWidth=".8" fill="none" strokeLinecap="round" opacity=".7" transform="translate(-.6 -.8)" />
        </g>
      ))}
      <Leaf x={34} y={70} len={30} rot={-10} gold />
      <Leaf x={58} y={42} len={26} rot={40} gold />
      <Leaf x={100} y={28} len={24} rot={80} gold />
      <Leaf x={40} y={122} len={22} rot={60} gold />
      <circle cx={118} cy={76} r={3.4} fill="url(#goldBall)" />
      <circle cx={63} cy={103} r={2.6} fill="url(#goldBall)" />
    </svg>
  );
}

export function Candelabra({ className, seed = 0 }: { className?: string; seed?: number }) {
  return (
    <svg className={className} viewBox="0 0 120 300" aria-hidden>
      <path d="M60 150 C 40 150 18 150 20 118" stroke="url(#gold)" strokeWidth="4" fill="none" />
      <path d="M60 150 C 80 150 102 150 100 118" stroke="url(#gold)" strokeWidth="4" fill="none" />
      <path d="M60 138 C 50 140 40 132 42 124 M60 138 C 70 140 80 132 78 124" stroke="url(#goldV)" strokeWidth="2" fill="none" />
      <rect x="57" y="96" width="6" height="170" fill="url(#goldH)" />
      {[150, 186, 214, 240].map((y, i) => (
        <ellipse key={y} cx="60" cy={y} rx={i === 0 ? 9 : 7} ry={i === 0 ? 7 : 5} fill="url(#goldBall)" />
      ))}
      <path d="M60 252 C 50 262 34 274 26 292 L 94 292 C 86 274 70 262 60 252Z" fill="url(#gold)" />
      <ellipse cx="60" cy="292" rx="36" ry="5" fill="url(#goldH)" />
      <Drop x={34} y={128} len={12} seed={seed + 1} />
      <Drop x={86} y={128} len={12} seed={seed + 2} />
      <Candle x={20} y={118} s={1.15} delay={seed * 0.3} />
      <Candle x={100} y={118} s={1.15} delay={seed * 0.3 + 0.4} />
      <Candle x={60} y={96} s={1.3} delay={seed * 0.3 + 0.8} />
    </svg>
  );
}

/** Small symmetric ornament: scrolling lines around a diamond. */
export function Flourish({ className, width = 200 }: { className?: string; width?: number }) {
  const half = "M8 0 C 18 -9 30 8 44 0 C 52 -5 58 -3 60 2 C 61 6 56 8 54 4 M44 0 C 60 6 80 1 96 0";
  return (
    <svg className={className} width={width} viewBox="-100 -12 200 24" aria-hidden>
      <path d={half} stroke="url(#goldH)" strokeWidth="1.2" fill="none" />
      <path d={half} stroke="url(#goldH)" strokeWidth="1.2" fill="none" transform="scale(-1 1)" />
      <path d="M0 -6 L4 0 L0 6 L-4 0Z" fill="url(#gold)" />
      <circle cx="-10" cy="0" r="1.4" fill="#e9c674" />
      <circle cx="10" cy="0" r="1.4" fill="#e9c674" />
    </svg>
  );
}

export function GarlandArt({ className, seed = 1 }: { className?: string; seed?: number }) {
  return (
    <svg className={className} viewBox="-200 -40 400 80" aria-hidden>
      <Garland seed={seed} />
    </svg>
  );
}
