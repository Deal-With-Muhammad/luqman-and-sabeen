// Hand-built SVG roses, leaves and gilded sprigs. All randomness is seeded so
// server and client render identical markup.

export function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 10000) / 10000;
  };
}

/** Round so server and browser serialise identical attribute strings. */
export const f = (n: number) => Math.round(n * 100) / 100;

function petalPath(rIn: number, rOut: number, w: number) {
  const mid = (rIn + rOut) / 2;
  return `M ${f(-w * 0.28)} ${f(-rIn)} Q ${f(-w * 1.05)} ${f(-mid)} ${f(-w * 0.62)} ${f(-rOut)} Q 0 ${f(-rOut * 1.13)} ${f(w * 0.62)} ${f(-rOut)} Q ${f(w * 1.05)} ${f(-mid)} ${f(w * 0.28)} ${f(-rIn)} Z`;
}

type Tone = "red" | "deep" | "blush";
const fills: Record<Tone, string> = {
  red: "url(#rosePetal)",
  deep: "url(#rosePetalDeep)",
  blush: "url(#rosePetalBlush)",
};

/** A rose centred on (x, y) with radius ~r. */
export function Rose({ x, y, r, seed = 1, tone = "red", tilt = 0 }: { x: number; y: number; r: number; seed?: number; tone?: Tone; tilt?: number }) {
  const rand = rng(seed * 7919);
  const rings = [
    { n: 7, rIn: 0.42, rOut: 1, w: 0.5, op: 1 },
    { n: 6, rIn: 0.3, rOut: 0.82, w: 0.42, op: 1 },
    { n: 5, rIn: 0.18, rOut: 0.62, w: 0.36, op: 1 },
    { n: 4, rIn: 0.08, rOut: 0.42, w: 0.28, op: 1 },
  ];
  const fill = fills[tone];
  const squash = 1 - Math.abs(tilt) * 0.35;
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt * 40}) scale(1 ${squash})`}>
      <circle r={r * 0.98} fill="#5a1a36" opacity=".55" />
      {rings.map((ring, ri) => {
        const off = rand() * 360;
        return Array.from({ length: ring.n }, (_, i) => {
          const a = off + (360 / ring.n) * i + (rand() - 0.5) * 14;
          const k = 0.9 + rand() * 0.18;
          return (
            <path
              key={`${ri}-${i}`}
              d={petalPath(r * ring.rIn, r * ring.rOut * k, r * ring.w)}
              transform={`rotate(${f(a)})`}
              fill={fill}
              stroke={tone === "blush" ? "rgba(255,215,190,.35)" : "rgba(255,225,235,.4)"}
              strokeWidth={r * 0.025}
            />
          );
        });
      })}
      <circle r={r * 0.2} fill="url(#roseCore)" />
      {Array.from({ length: 3 }, (_, i) => (
        <path
          key={i}
          d={`M ${f(-r * 0.16)} 0 A ${f(r * (0.16 - i * 0.04))} ${f(r * (0.16 - i * 0.04))} 0 1 1 ${f(r * (0.1 - i * 0.03))} ${f(r * 0.08)}`}
          fill="none"
          stroke={tone === "blush" ? "rgba(255,210,190,.55)" : "rgba(140,40,80,.45)"}
          strokeWidth={r * 0.035}
          transform={`rotate(${f(i * 120 + rand() * 30)})`}
        />
      ))}
    </g>
  );
}

export function Leaf({ x, y, len, rot, gold = false, w = 0.36 }: { x: number; y: number; len: number; rot: number; gold?: boolean; w?: number }) {
  const hw = len * w;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`M0 0 Q ${f(hw)} ${f(-len * 0.45)} 0 ${f(-len)} Q ${f(-hw)} ${f(-len * 0.45)} 0 0Z`} fill={gold ? "url(#leafGold)" : "url(#leaf)"} />
      <path d={`M0 0 Q ${f(hw * 0.12)} ${f(-len * 0.5)} 0 ${f(-len * 0.92)}`} stroke={gold ? "rgba(255,240,190,.55)" : "rgba(200,180,110,.35)"} strokeWidth={len * 0.025} fill="none" />
    </g>
  );
}

/** A curving gilded fern-like sprig. */
export function Sprig({ x, y, len, rot, seed = 3, curl = 0.25 }: { x: number; y: number; len: number; rot: number; seed?: number; curl?: number }) {
  const rand = rng(seed * 104729);
  const n = 9;
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    pts.push([Math.sin(t * Math.PI * 0.9) * len * curl, -t * len]);
  }
  const stem = `M0 0 ${pts.map((p) => `L${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ")}`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={stem} stroke="url(#goldV)" strokeWidth={len * 0.018} fill="none" strokeLinecap="round" />
      {pts.slice(1).map((p, i) => {
        const t = (i + 1) / n;
        const l = len * 0.17 * (1 - t * 0.6);
        return (
          <g key={i}>
            <Leaf x={f(p[0])} y={f(p[1])} len={f(l)} rot={f(-55 - rand() * 15)} gold w={0.3} />
            <Leaf x={f(p[0])} y={f(p[1])} len={f(l)} rot={f(55 + rand() * 15)} gold w={0.3} />
          </g>
        );
      })}
      <Leaf x={f(pts[n][0])} y={f(pts[n][1])} len={f(len * 0.12)} rot={0} gold w={0.3} />
    </g>
  );
}

export function Buds({ x, y, spread, n = 9, seed = 5 }: { x: number; y: number; spread: number; n?: number; seed?: number }) {
  const rand = rng(seed * 31337);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const a = rand() * Math.PI * 2;
        const d = Math.sqrt(rand()) * spread;
        return <circle key={i} cx={f(x + Math.cos(a) * d)} cy={f(y + Math.sin(a) * d)} r={f(spread * (0.06 + rand() * 0.05))} fill={i % 3 ? "#f6ead2" : "#e8c98a"} opacity=".92" />;
      })}
    </g>
  );
}

/**
 * Corner bouquet, drawn in a 300x300 box anchored bottom-left.
 * Mirror with transform="scale(-1 1)" for the right corner.
 */
export function CornerBouquet({ seed = 1 }: { seed?: number }) {
  return (
    <g>
      <Sprig x={40} y={300} len={230} rot={18} seed={seed + 1} curl={0.18} />
      <Sprig x={10} y={260} len={170} rot={-6} seed={seed + 2} curl={-0.2} />
      <Sprig x={120} y={300} len={150} rot={48} seed={seed + 3} curl={0.3} />
      <Leaf x={150} y={250} len={70} rot={70} />
      <Leaf x={30} y={170} len={64} rot={-20} />
      <Leaf x={95} y={190} len={58} rot={30} />
      <Leaf x={175} y={290} len={60} rot={95} gold />
      <Rose x={30} y={245} r={52} seed={seed + 11} tone="deep" />
      <Rose x={110} y={268} r={44} seed={seed + 12} />
      <Rose x={78} y={205} r={34} seed={seed + 13} tilt={0.3} />
      <Rose x={170} y={292} r={30} seed={seed + 14} tone="deep" tilt={-0.4} />
      <Rose x={5} y={180} r={30} seed={seed + 15} tilt={-0.2} />
      <Rose x={135} y={225} r={20} seed={seed + 16} tone="blush" />
      <Buds x={150} y={210} spread={26} seed={seed} />
      <Buds x={60} y={150} spread={22} seed={seed + 7} />
      <Buds x={205} y={265} spread={18} n={7} seed={seed + 9} />
    </g>
  );
}

/** Horizontal garland centred at (0,0), roughly 400 wide. */
export function Garland({ seed = 1, light = false }: { seed?: number; light?: boolean }) {
  return (
    <g>
      <Sprig x={-20} y={4} len={190} rot={-84} seed={seed + 1} curl={0.08} />
      <Sprig x={20} y={4} len={190} rot={84} seed={seed + 2} curl={-0.08} />
      <Sprig x={-40} y={10} len={120} rot={-105} seed={seed + 3} curl={0.15} />
      <Sprig x={40} y={10} len={120} rot={105} seed={seed + 4} curl={-0.15} />
      <Leaf x={-58} y={8} len={40} rot={-70} />
      <Leaf x={58} y={8} len={40} rot={70} />
      <Leaf x={-34} y={-12} len={34} rot={-40} />
      <Leaf x={34} y={-12} len={34} rot={40} />
      <Leaf x={-80} y={4} len={30} rot={-100} gold />
      <Leaf x={80} y={4} len={30} rot={100} gold />
      <Rose x={-48} y={6} r={18} seed={seed + 5} tone="deep" />
      <Rose x={48} y={6} r={18} seed={seed + 6} tone="deep" />
      <Rose x={-22} y={2} r={21} seed={seed + 7} tone={light ? "blush" : "red"} />
      <Rose x={22} y={2} r={21} seed={seed + 8} />
      <Rose x={0} y={-4} r={25} seed={seed + 9} />
      <Rose x={-72} y={10} r={12} seed={seed + 10} tilt={0.3} />
      <Rose x={72} y={10} r={12} seed={seed + 11} tilt={-0.3} />
      <Buds x={-100} y={2} spread={12} n={6} seed={seed + 12} />
      <Buds x={100} y={2} spread={12} n={6} seed={seed + 13} />
      <Buds x={0} y={18} spread={14} n={6} seed={seed + 14} />
    </g>
  );
}
