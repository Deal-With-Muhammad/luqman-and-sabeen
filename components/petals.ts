/** Rains rose petals over the page once. Pure DOM so it can be called anywhere. */
export function showerPetals(count = 38) {
  if (typeof document === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const layer = document.createElement("div");
  layer.className = "petal-shower";
  const tones = ["#c4587d", "#e68fab", "#8c3a5a", "#f4b6c8", "#c9a35f"];
  let longest = 0;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("i");
    const dur = 3.2 + Math.random() * 2.6;
    const delay = Math.random() * 1.1;
    longest = Math.max(longest, dur + delay);
    const size = 9 + Math.random() * 10;
    p.style.cssText = [
      `left:${Math.random() * 100}%`,
      `width:${size}px`,
      `height:${size * 0.82}px`,
      `--drift:${(Math.random() - 0.5) * 160}px`,
      `--spin:${(Math.random() - 0.5) * 900}deg`,
      `background:radial-gradient(circle at 30% 30%, rgba(255,255,255,.35), transparent 55%), ${tones[i % tones.length]}`,
      `animation-duration:${dur}s`,
      `animation-delay:${delay}s`,
    ].join(";");
    layer.appendChild(p);
  }
  document.body.appendChild(layer);
  window.setTimeout(() => layer.remove(), (longest + 0.3) * 1000);
}
