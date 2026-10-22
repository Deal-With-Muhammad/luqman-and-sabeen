"use client";

import { useEffect, useRef } from "react";

/** Slow-rising, twinkling gold motes over the stage. */
export default function GoldDust({ count = 46 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const motes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.5 + Math.random() * 1.5,
      vy: 0.08 + Math.random() * 0.28,
      sway: Math.random() * Math.PI * 2,
      tw: Math.random() * Math.PI * 2,
    }));

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.y -= m.vy;
        m.sway += 0.01;
        m.tw += 0.04;
        if (m.y < -10) {
          m.y = h + 10;
          m.x = Math.random() * w;
        }
        const x = m.x + Math.sin(m.sway) * 12;
        const a = 0.25 + (Math.sin(m.tw) + 1) * 0.35;
        const g = ctx.createRadialGradient(x, m.y, 0, x, m.y, m.r * 4);
        g.addColorStop(0, `rgba(255,236,180,${a})`);
        g.addColorStop(0.4, `rgba(232,190,100,${a * 0.5})`);
        g.addColorStop(1, "rgba(232,190,100,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, m.y, m.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      if (visible) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      visible = false;
      frame();
    }

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return <canvas ref={ref} className="gold-dust" aria-hidden />;
}
