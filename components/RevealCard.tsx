"use client";

import { useEffect, useRef, useState } from "react";
import { showerPetals } from "./petals";

const WIPE_MS = 1100;

function paintFoil(ctx: CanvasRenderingContext2D, w: number, h: number, fonts: { display: string; body: string }) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#8a5a4c");
  g.addColorStop(0.25, "#e9b9a6");
  g.addColorStop(0.45, "#b97f6c");
  g.addColorStop(0.6, "#f7d9cc");
  g.addColorStop(0.8, "#a86e5e");
  g.addColorStop(1, "#d8a594");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // brushed-metal grain
  for (let i = 0; i < w * h * 0.012; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? "rgba(255,248,220,.35)" : "rgba(110,60,50,.2)";
    ctx.fillRect(Math.random() * w, Math.random() * h, Math.random() * 6 + 1, 0.7);
  }

  // inset border
  ctx.strokeStyle = "rgba(90, 34, 56,.35)";
  ctx.lineWidth = 1;
  ctx.strokeRect(12.5, 12.5, w - 25, h - 25);
  ctx.strokeStyle = "rgba(255,245,215,.5)";
  ctx.strokeRect(17.5, 17.5, w - 35, h - 35);

  // label
  const s = Math.min(w, h);
  ctx.fillStyle = "rgba(90, 34, 56,.82)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `italic 400 ${Math.round(s * 0.17)}px ${fonts.display}`;
  ctx.fillText("Tap Here", w / 2, h / 2 + s * 0.06);
  ctx.font = `650 ${Math.max(9, Math.round(w * 0.026))}px ${fonts.body}`;
  ctx.letterSpacing = "3px";
  ctx.fillText("✦  TO REVEAL THE DATE  ✦", w / 2, h / 2 + s * 0.22);
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function RevealCard({
  kicker,
  date,
  weekday,
  time,
  blessing,
  onReveal,
}: {
  kicker: string;
  date: string;
  weekday: string;
  time: string;
  blessing?: string;
  onReveal?: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"idle" | "opening" | "revealed">("idle");
  const started = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const wrap = wrapRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const setup = () => {
      if (started.current) return;
      const { width, height } = wrap.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const css = getComputedStyle(wrap);
      paintFoil(ctx, width, height, {
        display: css.getPropertyValue("--font-display") || "serif",
        body: css.getPropertyValue("--font-body") || "sans-serif",
      });
    };
    setup();
    document.fonts?.ready.then(setup);
    const ro = new ResizeObserver(setup);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  const reveal = (clientX?: number, clientY?: number) => {
    if (started.current) return;
    started.current = true;
    setState("opening");
    onReveal?.();

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const r = canvas.getBoundingClientRect();
    const x = clientX == null ? r.width / 2 : clientX - r.left;
    const y = clientY == null ? r.height / 2 : clientY - r.top;
    const maxR = Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y)) + 40;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dur = reduce ? 1 : WIPE_MS;
    const t0 = performance.now();

    // the foil dissolves outward from the tap, with a soft feathered edge
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      const rad = easeInOut(t) * maxR;
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      const g = ctx.createRadialGradient(x, y, Math.max(0, rad - 46), x, y, rad);
      g.addColorStop(0, "rgba(0,0,0,1)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      if (t < 1) requestAnimationFrame(step);
      else {
        setState("revealed");
        showerPetals();
      }
    };
    requestAnimationFrame(step);
  };

  return (
    <div
      ref={wrapRef}
      className={`reveal-wrap is-${state}`}
      onClick={(e) => reveal(e.clientX, e.clientY)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), reveal())}
      role={state === "idle" ? "button" : undefined}
      tabIndex={state === "idle" ? 0 : -1}
      aria-label={state === "idle" ? "Tap to reveal the date" : undefined}
    >
      <div className="date-reveal">
        <span className="date-kicker">{kicker}</span>
        <strong className="date-main">{date}</strong>
        <div className="date-day">
          <span>{weekday}</span>
          <i>⬩</i>
          <span>{time}</span>
        </div>
        {blessing && <em className="date-blessing">{blessing}</em>}
      </div>
      <canvas ref={canvasRef} className="reveal-canvas" aria-hidden />
      <span className="reveal-hint" aria-hidden />
    </div>
  );
}
