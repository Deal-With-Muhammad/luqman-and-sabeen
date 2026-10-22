"use client";

import { useEffect, useState } from "react";

const pad = (n: number) => String(Math.max(0, n)).padStart(2, "0");

export default function Countdown({ target }: { target: string }) {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const t = new Date(target).getTime();
    const tick = () => setLeft(Math.max(0, t - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const s = left == null ? 0 : Math.floor(left / 1000);
  const units: [string, number][] = [
    ["days", Math.floor(s / 86400)],
    ["hours", Math.floor((s % 86400) / 3600)],
    ["minutes", Math.floor((s % 3600) / 60)],
    ["seconds", s % 60],
  ];

  return (
    <div className="countdown reveal">
      {units.map(([label, v]) => (
        <div key={label}>
          <strong suppressHydrationWarning>{pad(v)}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
