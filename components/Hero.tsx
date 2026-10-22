"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import Bismillah from "./art/Bismillah";
import Chandelier from "./art/Chandelier";
import { CornerBouquet } from "./art/Florals";
import { Candelabra, Drape, Flourish, GoldScroll, Tassel, Valance } from "./art/Stage";
import GoldDust from "./GoldDust";
import { invite } from "@/lib/invite";

export type HeroPhase = "closed" | "opening" | "open";

const EASE_CURTAIN = [0.7, 0, 0.3, 1] as const;
const EASE_OUT = [0.16, 0.75, 0.25, 1] as const;

export default function Hero({ onOpen }: { onOpen: () => void }) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<HeroPhase>("closed");
  const [lit, setLit] = useState(false);
  const opened = phase !== "closed";
  const k = reduce ? 0.15 : 1; // time scale

  useEffect(() => {
    document.body.classList.toggle("intro-locked", phase !== "open");
  }, [phase]);

  const open = () => {
    if (opened) return;
    setPhase("opening");
    onOpen();
    window.setTimeout(() => setLit(true), 900 * k);
    window.setTimeout(() => setPhase("open"), 3900 * k);
  };

  const { bride, groom } = invite;

  return (
    <section
      id="hero"
      className={`hero is-${phase}${lit ? " is-lit" : ""}`}
      onClick={open}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && open()}
      role={opened ? undefined : "button"}
      tabIndex={opened ? -1 : 0}
      aria-label={opened ? undefined : "Tap to open the invitation"}
    >
      {/* ── the stage behind the curtains ── */}
      <motion.div
        className="stage"
        initial={false}
        animate={opened ? { scale: 1 } : { scale: 1.2 }}
        transition={{ duration: 5.2 * k, ease: EASE_OUT, delay: 0.2 * k }}
      >
        <div className="stage-wall" />
        <div className="stage-spot" />
        <div className="stage-arch" aria-hidden>
          <svg className="arch-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M6 100 V 34 Q 6 7 50 6 Q 94 7 94 34 V 100" />
            <path d="M9 100 V 35 Q 9 10 50 9.2 Q 91 10 91 35 V 100" className="thin" />
          </svg>
          <GoldScroll className="arch-scroll arch-scroll-l" />
          <GoldScroll className="arch-scroll arch-scroll-r" />
          <GoldScroll className="arch-scroll arch-foot-l" />
          <GoldScroll className="arch-scroll arch-foot-r" />
        </div>

        <motion.div
          className="stage-chandelier"
          initial={false}
          animate={opened ? { y: "0%", opacity: 1 } : { y: "-28%", opacity: 0.85 }}
          transition={{ duration: 3.4 * k, ease: EASE_OUT, delay: 0.5 * k }}
        >
          <div className="swing">
            <Chandelier />
          </div>
        </motion.div>

        <Candelabra className="candelabra candelabra-l" seed={1} />
        <Candelabra className="candelabra candelabra-r" seed={4} />

        <Drape className="drape drape-l" />
        <Drape className="drape drape-r" />
        <Tassel className="tassel tassel-l" />
        <Tassel className="tassel tassel-r" />

        <motion.div
          className="stage-dim"
          initial={false}
          animate={{ opacity: lit ? 0 : 0.78 }}
          transition={{ duration: 2.2 * k, ease: "easeOut" }}
        />
      </motion.div>

      {/* ── the closed curtains ── */}
      <motion.div
        className="curtain curtain-l"
        initial={false}
        animate={opened ? { x: "-104%", scaleX: 0.55, skewY: -1.5 } : { x: "0%", scaleX: 1, skewY: 0 }}
        transition={{ duration: 2.8 * k, ease: EASE_CURTAIN, delay: 0.25 * k }}
      />
      <motion.div
        className="curtain curtain-r"
        initial={false}
        animate={opened ? { x: "104%", scaleX: 0.55, skewY: 1.5 } : { x: "0%", scaleX: 1, skewY: 0 }}
        transition={{ duration: 2.8 * k, ease: EASE_CURTAIN, delay: 0.25 * k }}
      />

      <Valance className="stage-valance" />

      <svg className="bouquet bouquet-l" viewBox="-20 60 300 260" aria-hidden>
        <CornerBouquet seed={3} />
      </svg>
      <svg className="bouquet bouquet-r" viewBox="-20 60 300 260" aria-hidden>
        <CornerBouquet seed={9} />
      </svg>

      <div className="hero-vignette" />
      <GoldDust />

      {/* ── tap to open ── */}
      <div className="opening-mark" aria-hidden={opened}>
        <span className="opening-ripple" />
        <div className="opening-words">
          <Flourish className="opening-flourish" width={110} />
          <span className="opening-text">tap to open</span>
          <Flourish className="opening-flourish flip" width={190} />
        </div>
      </div>

      {/* ── the invitation ── */}
      <div className="hero-content">
        <div className="bismillah">
          <Bismillah />
        </div>
        {invite.bismillahTranslation && <p className="translation">{invite.bismillahTranslation}</p>}
        <div className="hero-divider">
          <span>✦</span>
        </div>
        <p className="hero-welcome">{invite.welcomeLine}</p>
        <div className="couple-names">
          <div>
            <h1>
              <span>{bride.first}</span> {bride.last}
            </h1>
            <p>{bride.relation}</p>
            <small>{bride.parents}</small>
            {bride.grandparents && <small className="families__grandparents">{bride.grandparents}</small>}
          </div>
          <span className="name-ampersand">&amp;</span>
          <div>
            <h1>
              <span>{groom.first}</span> {groom.last}
            </h1>
            <p>{groom.relation}</p>
            <small>{groom.parents}</small>
            {groom.grandparents && <small className="families__grandparents">{groom.grandparents}</small>}
          </div>
        </div>
        <p className="hero-closing">{invite.closingLine}</p>
        <a className="scroll-cue" href="#welcome" onClick={(e) => e.stopPropagation()}>
          <span>Scroll</span>
          <i />
        </a>
      </div>
    </section>
  );
}
