"use client";

import { useEffect, useRef, useState } from "react";
import { showerPetals } from "./petals";

const BRUSH = 24;
const THRESHOLD = 0.48;

function paintFoil(ctx: CanvasRenderingContext2D, w: number, h: number, fonts: { display: string; body: string }) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#8a6222");
  g.addColorStop(0.25, "#e9c879");
  g.addColorStop(0.45, "#b8893b");
  g.addColorStop(0.6, "#f7e2a4");
  g.addColorStop(0.8, "#a67a2c");
  g.addColorStop(1, "#d8b467");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // brushed-metal grain
  for (let i = 0; i < w * h * 0.012; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    ctx.fillStyle = Math.random() > 0.5 ? "rgba(255,248,220,.35)" : "rgba(90,58,10,.22)";
    ctx.fillRect(x, y, Math.random() * 6 + 1, 0.7);
  }
  // soft diagonal sheen
  const sheen = ctx.createLinearGradient(0, h, w, 0);
  sheen.addColorStop(0.35, "rgba(255,255,255,0)");
  sheen.addColorStop(0.5, "rgba(255,255,255,.35)");
  sheen.addColorStop(0.65, "rgba(255,255,255,0)");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, w, h);

  // inset border + label
  ctx.strokeStyle = "rgba(58,7,12,.35)";
  ctx.lineWidth = 1;
  ctx.strokeRect(12.5, 12.5, w - 25, h - 25);
  ctx.strokeStyle = "rgba(255,245,215,.5)";
  ctx.strokeRect(17.5, 17.5, w - 35, h - 35);

  ctx.fillStyle = "rgba(58,7,12,.82)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `italic 400 ${Math.round(Math.min(w, h) * 0.17)}px ${fonts.display}`;
  ctx.fillText("Scratch Here", w / 2, h / 2 - 6);
  ctx.font = `650 ${Math.max(9, Math.round(w * 0.026))}px ${fonts.body}`;
  ctx.letterSpacing = "3px";
  ctx.fillText("✦  TO REVEAL THE DATE  ✦", w / 2, h / 2 + Math.min(w, h) * 0.17);
}

export default function ScratchCard({
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
  const [revealed, setRevealed] = useState(false);
  const revealedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const wrap = wrapRef.current!;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let last: [number, number] | null = null;
    let moves = 0;

    const setup = () => {
      if (revealedRef.current) return;
      const { width, height } = wrap.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
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

    const point = (e: PointerEvent): [number, number] => {
      const r = canvas.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };

    const progress = () => {
      const { width, height } = canvas;
      const data = ctx.getImageData(0, 0, width, height).data;
      let clear = 0;
      let total = 0;
      const step = 4 * 24;
      for (let i = 3; i < data.length; i += step) {
        total++;
        if (data[i] < 40) clear++;
      }
      return clear / total;
    };

    const scratch = (from: [number, number], to: [number, number]) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "#000";
      ctx.fillStyle = "#000";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = BRUSH * 2;
      ctx.beginPath();
      ctx.moveTo(from[0], from[1]);
      ctx.lineTo(to[0], to[1]);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(to[0], to[1], BRUSH, 0, Math.PI * 2);
      ctx.fill();
    };

    const reveal = () => {
      if (revealedRef.current) return;
      revealedRef.current = true;
      setRevealed(true);
      showerPetals();
      onReveal?.();
    };

    const down = (e: PointerEvent) => {
      if (revealedRef.current) return;
      canvas.setPointerCapture(e.pointerId);
      last = point(e);
      scratch(last, last);
    };
    const move = (e: PointerEvent) => {
      if (!last || revealedRef.current) return;
      const p = point(e);
      scratch(last, p);
      last = p;
      if (++moves % 8 === 0 && progress() > THRESHOLD) reveal();
    };
    const up = () => {
      if (last && !revealedRef.current && progress() > THRESHOLD) reveal();
      last = null;
    };

    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    return () => {
      ro.disconnect();
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
    };
  }, [onReveal]);

  return (
    <div ref={wrapRef} className={`scratch-wrap${revealed ? " is-revealed" : ""}`}>
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
      <canvas
        ref={canvasRef}
        className="scratch-canvas"
        tabIndex={0}
        aria-label="Scratch card hiding the date. Press Enter to reveal."
        onKeyDown={(e) => {
          if (e.key === "Enter" && !revealedRef.current) {
            revealedRef.current = true;
            setRevealed(true);
            showerPetals();
            onReveal?.();
          }
        }}
      />
    </div>
  );
}
