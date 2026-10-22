// Gradients referenced document-wide via url(#id) by every inline SVG.
export default function Defs() {
  return (
    <svg aria-hidden width="0" height="0" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
      <defs>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7a5418" />
          <stop offset=".22" stopColor="#f6dc94" />
          <stop offset=".42" stopColor="#b6862f" />
          <stop offset=".62" stopColor="#ffeaa8" />
          <stop offset=".82" stopColor="#9a6c22" />
          <stop offset="1" stopColor="#e9c674" />
        </linearGradient>
        <linearGradient id="goldV" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff0b8" />
          <stop offset=".35" stopColor="#d4a548" />
          <stop offset=".6" stopColor="#8c6020" />
          <stop offset="1" stopColor="#e2bb63" />
        </linearGradient>
        <linearGradient id="goldH" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7d561b" />
          <stop offset=".3" stopColor="#f3d585" />
          <stop offset=".5" stopColor="#fff3c4" />
          <stop offset=".7" stopColor="#c9963c" />
          <stop offset="1" stopColor="#6f4a14" />
        </linearGradient>
        <radialGradient id="goldBall" cx=".35" cy=".3" r=".75">
          <stop offset="0" stopColor="#fff8d8" />
          <stop offset=".35" stopColor="#e7bf62" />
          <stop offset="1" stopColor="#6d4812" />
        </radialGradient>

        <radialGradient id="rosePetal" cx=".5" cy="1" r="1.05">
          <stop offset="0" stopColor="#2a0205" />
          <stop offset=".45" stopColor="#7d0b17" />
          <stop offset=".8" stopColor="#b51a28" />
          <stop offset="1" stopColor="#d9404a" />
        </radialGradient>
        <radialGradient id="rosePetalDeep" cx=".5" cy="1" r="1.05">
          <stop offset="0" stopColor="#1c0103" />
          <stop offset=".5" stopColor="#5e0711" />
          <stop offset=".85" stopColor="#951423" />
          <stop offset="1" stopColor="#c3303c" />
        </radialGradient>
        <radialGradient id="rosePetalBlush" cx=".5" cy="1" r="1.05">
          <stop offset="0" stopColor="#7a2a22" />
          <stop offset=".5" stopColor="#c45a4a" />
          <stop offset=".85" stopColor="#e88b72" />
          <stop offset="1" stopColor="#f6b9a0" />
        </radialGradient>
        <radialGradient id="roseCore" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#120002" />
          <stop offset="1" stopColor="#5a0610" />
        </radialGradient>

        <linearGradient id="leaf" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#2f3315" />
          <stop offset=".55" stopColor="#5d5a24" />
          <stop offset="1" stopColor="#a08a45" />
        </linearGradient>
        <linearGradient id="leafGold" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#6e5420" />
          <stop offset=".6" stopColor="#c7a253" />
          <stop offset="1" stopColor="#f1d999" />
        </linearGradient>

        <radialGradient id="flame" cx=".5" cy=".72" r=".6">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".3" stopColor="#fff2b0" />
          <stop offset=".65" stopColor="#ffb43b" />
          <stop offset="1" stopColor="#ff7a00" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glow" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#ffe3a0" stopOpacity=".95" />
          <stop offset=".35" stopColor="#ffb85a" stopOpacity=".35" />
          <stop offset="1" stopColor="#ff8a2a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="candle" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d8cbb4" />
          <stop offset=".4" stopColor="#fffaf0" />
          <stop offset="1" stopColor="#b9a88c" />
        </linearGradient>
        <radialGradient id="crystal" cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".4" stopColor="#fff4d6" stopOpacity=".9" />
          <stop offset="1" stopColor="#c99a4a" stopOpacity=".55" />
        </radialGradient>
      </defs>
    </svg>
  );
}
