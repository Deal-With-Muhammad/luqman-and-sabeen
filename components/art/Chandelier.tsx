import { f, rng } from "./Florals";

// Crystal chandelier drawn in a 400 x 420 box. Two tiers of candle arms laid
// out on ellipses so the back arms sit behind the stem and the front ones in
// front of it. Flames flicker and crystals glint via CSS (see globals.css).

type Arm = { x: number; y: number; back: boolean; i: number };

function tier(cx: number, cy: number, rx: number, ry: number, n: number, phase: number): Arm[] {
  return Array.from({ length: n }, (_, i) => {
    const a = phase + (i / n) * Math.PI * 2;
    return { x: f(cx + Math.cos(a) * rx), y: f(cy + Math.sin(a) * ry), back: Math.sin(a) < 0, i };
  });
}

export function Candle({ x, y, s, delay }: { x: number; y: number; s: number; delay: number }) {
  const h = 30 * s;
  const w = 7 * s;
  return (
    <g>
      <circle className="ch-glow" cx={x} cy={f(y - h - 9 * s)} r={f(34 * s)} fill="url(#glow)" style={{ animationDelay: `${delay}s` }} />
      <ellipse cx={x} cy={y} rx={f(13 * s)} ry={f(4 * s)} fill="url(#goldH)" />
      <path d={`M${f(x - 9 * s)} ${y} q ${f(9 * s)} ${f(10 * s)} ${f(18 * s)} 0`} fill="url(#goldV)" />
      <rect x={f(x - w / 2)} y={f(y - h)} width={f(w)} height={f(h)} rx={f(1.5 * s)} fill="url(#candle)" />
      <g className="ch-flame" style={{ animationDelay: `${delay}s`, transformOrigin: `${x}px ${f(y - h)}px` }}>
        <path
          d={`M${x} ${f(y - h - 17 * s)} C ${f(x + 5.5 * s)} ${f(y - h - 8 * s)} ${f(x + 4.5 * s)} ${f(y - h + 1 * s)} ${x} ${f(y - h + 1 * s)} C ${f(x - 4.5 * s)} ${f(y - h + 1 * s)} ${f(x - 5.5 * s)} ${f(y - h - 8 * s)} ${x} ${f(y - h - 17 * s)} Z`}
          fill="url(#flame)"
        />
      </g>
    </g>
  );
}

function ArmPath({ from, to, drop }: { from: [number, number]; to: Arm; drop: number }) {
  const [sx, sy] = from;
  const mx = (sx + to.x) / 2;
  const d = `M${sx} ${sy} C ${f(mx)} ${f(sy + drop)} ${f(to.x)} ${f(to.y + drop * 0.9)} ${to.x} ${f(to.y + 8)}`;
  return (
    <g>
      <path d={d} stroke="#5a3a0e" strokeWidth={7} fill="none" strokeLinecap="round" opacity={to.back ? 0.6 : 0.8} />
      <path d={d} stroke="url(#gold)" strokeWidth={4.4} fill="none" strokeLinecap="round" opacity={to.back ? 0.75 : 1} />
      {/* little curl under each arm */}
      <path d={`M${f(mx)} ${f(sy + drop * 0.55)} q ${f((to.x - sx) * 0.08)} ${f(14)} ${f((to.x - sx) * 0.16)} 4`} stroke="url(#goldV)" strokeWidth={2} fill="none" opacity={to.back ? 0.6 : 1} />
    </g>
  );
}

function Strand({ a, b, sag, beads, seed }: { a: [number, number]; b: [number, number]; sag: number; beads: number; seed: number }) {
  const rand = rng(seed);
  return (
    <g>
      {Array.from({ length: beads + 1 }, (_, i) => {
        const t = i / beads;
        const x = a[0] + (b[0] - a[0]) * t;
        const y = a[1] + (b[1] - a[1]) * t + Math.sin(t * Math.PI) * sag;
        const r = 1.9 + rand() * 0.9;
        return <circle key={i} cx={f(x)} cy={f(y)} r={f(r)} fill="url(#crystal)" />;
      })}
    </g>
  );
}

export function Drop({ x, y, len, seed }: { x: number; y: number; len: number; seed: number }) {
  const rand = rng(seed);
  const n = 3 + Math.floor(rand() * 3);
  const items = [];
  for (let i = 0; i < n; i++) items.push(<circle key={i} cx={x} cy={f(y + i * 5.2)} r={1.7} fill="url(#crystal)" />);
  const ty = y + n * 5.2;
  return (
    <g>
      {items}
      <path d={`M${x} ${f(ty)} l ${f(len * 0.28)} ${f(len * 0.55)} l ${f(-len * 0.28)} ${f(len * 0.45)} l ${f(-len * 0.28)} ${f(-len * 0.45)} Z`} fill="url(#crystal)" stroke="rgba(255,255,255,.6)" strokeWidth={0.5} />
    </g>
  );
}

function Glint({ x, y, s, delay }: { x: number; y: number; s: number; delay: number }) {
  return (
    <path
      className="ch-glint"
      style={{ animationDelay: `${delay}s`, transformOrigin: `${x}px ${y}px` }}
      d={`M${x} ${f(y - 6 * s)} L${f(x + 1.1 * s)} ${f(y - 1.1 * s)} L${f(x + 6 * s)} ${y} L${f(x + 1.1 * s)} ${f(y + 1.1 * s)} L${x} ${f(y + 6 * s)} L${f(x - 1.1 * s)} ${f(y + 1.1 * s)} L${f(x - 6 * s)} ${y} L${f(x - 1.1 * s)} ${f(y - 1.1 * s)}Z`}
      fill="#fff"
    />
  );
}

export default function Chandelier({ className }: { className?: string }) {
  const cx = 200;
  const lower = tier(cx, 262, 150, 30, 8, Math.PI / 8);
  const upper = tier(cx, 178, 92, 18, 6, 0);
  const hubLow: [number, number] = [cx, 285];
  const hubUp: [number, number] = [cx, 200];

  const lowerBack = lower.filter((a) => a.back);
  const lowerFront = lower.filter((a) => !a.back);
  const upperBack = upper.filter((a) => a.back);
  const upperFront = upper.filter((a) => !a.back);

  const rand = rng(99);
  const glints = Array.from({ length: 16 }, (_, i) => ({
    x: f(cx + (rand() - 0.5) * 300),
    y: f(190 + rand() * 170),
    s: f(0.8 + rand() * 0.9),
    d: f(rand() * 4),
    i,
  }));

  const ring = (arms: Arm[], cy: number) => [...arms].sort((p, q) => Math.atan2(p.y - cy, p.x - cx) - Math.atan2(q.y - cy, q.x - cx));

  return (
    <svg className={className} viewBox="0 0 400 420" aria-hidden>
      {/* warm halo */}
      <ellipse cx={cx} cy={240} rx={200} ry={170} fill="url(#glow)" opacity=".55" className="ch-halo" />

      {/* chain */}
      {Array.from({ length: 9 }, (_, i) => (
        <ellipse key={i} cx={cx} cy={4 + i * 9} rx={i % 2 ? 2 : 4} ry={5} fill="none" stroke="url(#goldV)" strokeWidth={1.8} />
      ))}
      {/* canopy */}
      <path d={`M${cx - 26} 96 Q ${cx} 70 ${cx + 26} 96 Z`} fill="url(#gold)" />

      {/* crown of beads */}
      {Array.from({ length: 10 }, (_, i) => (
        <Strand key={i} a={[cx, 100]} b={[f(cx - 70 + i * 15.5), 175]} sag={6} beads={9} seed={i + 40} />
      ))}

      {/* back arms */}
      {upperBack.map((a) => <ArmPath key={`ub${a.i}`} from={hubUp} to={a} drop={22} />)}
      {lowerBack.map((a) => <ArmPath key={`lb${a.i}`} from={hubLow} to={a} drop={38} />)}
      {upperBack.map((a) => <Candle key={`ubc${a.i}`} x={a.x} y={a.y} s={0.82} delay={a.i * 0.37} />)}
      {lowerBack.map((a) => <Candle key={`lbc${a.i}`} x={a.x} y={a.y} s={0.9} delay={a.i * 0.29 + 0.2} />)}

      {/* stem */}
      <rect x={cx - 4} y={96} width={8} height={210} fill="url(#goldH)" />
      <ellipse cx={cx} cy={150} rx={14} ry={10} fill="url(#goldBall)" />
      <ellipse cx={cx} cy={200} rx={24} ry={9} fill="url(#goldH)" />
      <path d={`M${cx - 18} 205 Q ${cx} 250 ${cx + 18} 205 Z`} fill="url(#goldV)" />
      <ellipse cx={cx} cy={285} rx={34} ry={11} fill="url(#goldH)" />
      <path d={`M${cx - 30} 290 Q ${cx} 340 ${cx + 30} 290 Z`} fill="url(#gold)" />
      <circle cx={cx} cy={334} r={11} fill="url(#crystal)" stroke="rgba(255,240,200,.7)" strokeWidth={0.6} />

      {/* crystal swags between lower arms */}
      {ring(lower, 262).map((a, i, arr) => {
        const b = arr[(i + 1) % arr.length];
        return <Strand key={`sw${i}`} a={[a.x, a.y + 10]} b={[b.x, b.y + 10]} sag={26} beads={14} seed={i + 7} />;
      })}
      {ring(upper, 178).map((a, i, arr) => {
        const b = arr[(i + 1) % arr.length];
        return <Strand key={`su${i}`} a={[a.x, a.y + 8]} b={[b.x, b.y + 8]} sag={16} beads={10} seed={i + 70} />;
      })}

      {/* front arms */}
      {upperFront.map((a) => <ArmPath key={`uf${a.i}`} from={hubUp} to={a} drop={22} />)}
      {lowerFront.map((a) => <ArmPath key={`lf${a.i}`} from={hubLow} to={a} drop={38} />)}
      {lower.map((a) => <Drop key={`d${a.i}`} x={a.x} y={a.y + 12} len={16} seed={a.i + 300} />)}
      {Array.from({ length: 9 }, (_, i) => (
        <Drop key={`cd${i}`} x={f(cx - 40 + i * 10)} y={f(300 + Math.sin((i / 8) * Math.PI) * 26)} len={14 + (i % 3) * 4} seed={i + 500} />
      ))}
      <Drop x={cx} y={346} len={30} seed={777} />
      {upperFront.map((a) => <Candle key={`ufc${a.i}`} x={a.x} y={a.y} s={0.82} delay={a.i * 0.41 + 0.1} />)}
      {lowerFront.map((a) => <Candle key={`lfc${a.i}`} x={a.x} y={a.y} s={1} delay={a.i * 0.33 + 0.3} />)}

      {glints.map((g) => <Glint key={g.i} x={g.x} y={g.y} s={g.s} delay={g.d} />)}
    </svg>
  );
}
