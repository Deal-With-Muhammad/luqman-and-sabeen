"use client";

import { useEffect, useState } from "react";
import type { GalleryItem } from "@/lib/invite";

export default function Gallery({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % items.length), 4800);
    return () => window.clearInterval(id);
  }, [items.length, active]);

  return (
    <>
      <div className="gallery-frame reveal">
        {items.map((it, i) => (
          <figure key={it.src} className={`gallery-slide${i === active ? " is-active" : ""}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.src} alt={it.caption ?? ""} loading="lazy" />
            {it.caption && <figcaption>{it.caption}</figcaption>}
          </figure>
        ))}
        <span className="gallery-corner gallery-corner-a" />
        <span className="gallery-corner gallery-corner-b" />
      </div>
      {items.length > 1 && (
        <div className="gallery-dots reveal">
          {items.map((it, i) => (
            <button key={it.src} className={i === active ? "is-active" : ""} onClick={() => setActive(i)} aria-label={`Show photo ${i + 1}`} />
          ))}
        </div>
      )}
    </>
  );
}
