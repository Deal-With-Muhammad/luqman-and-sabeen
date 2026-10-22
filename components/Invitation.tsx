"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { eventDate, formatLongDate, formatWeekday, invite } from "@/lib/invite";
import { Music } from "@/lib/music";
import { GarlandArt } from "./art/Stage";
import Countdown from "./Countdown";
import Gallery from "./Gallery";
import Hero from "./Hero";
import ScratchCard from "./ScratchCard";

function FloralDivider({ seed }: { seed: number }) {
  return (
    <div className="floral-divider" aria-hidden>
      <GarlandArt seed={seed} />
    </div>
  );
}

function Heading({ eyebrow, title, id }: { eyebrow: string; title: string; id?: string }) {
  return (
    <header className="section-heading reveal">
      <span className="eyebrow">{eyebrow}</span>
      <h2 id={id}>{title}</h2>
      <span className="ornament">
        <i />
      </span>
    </header>
  );
}

function Names() {
  return (
    <>
      {invite.bride.first} <span>&amp;</span> {invite.groom.first}
    </>
  );
}

export default function Invitation() {
  const music = useRef<Music | null>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  const longDate = formatLongDate(eventDate);

  // reveal-on-scroll
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.16, rootMargin: "0px 0px -6% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // pause when the tab is hidden, resume when back
  useEffect(() => {
    const onVis = () => {
      if (!music.current) return;
      if (document.hidden) music.current.pause();
      else if (playing) music.current.play();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [playing]);

  const handleOpen = useCallback(() => {
    music.current ??= new Music(invite.music);
    music.current.play(true);
    setPlaying(true);
    setStarted(true);
  }, []);

  const toggleMusic = () => {
    music.current ??= new Music(invite.music);
    if (playing) music.current.pause();
    else music.current.play();
    setPlaying(!playing);
  };

  const onReveal = useCallback(() => music.current?.chime(), []);

  return (
    <main id="invitation">
      <button
        className={`music-toggle${playing ? " is-playing" : ""}${started ? " is-shown" : ""}`}
        onClick={toggleMusic}
        aria-label={playing ? "Pause music" : "Play music"}
        aria-pressed={playing}
      >
        <span className="music-bars">
          <i />
          <i />
          <i />
        </span>
      </button>

      <Hero onOpen={handleOpen} />

      <FloralDivider seed={2} />

      <section id="welcome" className="welcome-section section-pad">
        <div className="section-shell welcome-shell">
          <div className="welcome-copy reveal">
            <h2>{invite.welcome.title}</h2>
            <p>{invite.welcome.body}</p>
            <div className="signature">
              <Names />
            </div>
          </div>
        </div>
      </section>

      <FloralDivider seed={5} />

      <section id="date" className="scratch-section section-pad">
        <div className="section-shell">
          <Heading eyebrow={invite.scratch.eyebrow} title={invite.scratch.title} />
          <div className="scratch-frame-shell reveal">
            <ScratchCard
              kicker={invite.scratch.kicker}
              date={longDate}
              weekday={formatWeekday(eventDate)}
              time={invite.timeLabel}
              onReveal={onReveal}
            />
            <span className="frame-corner tl" />
            <span className="frame-corner tr" />
            <span className="frame-corner bl" />
            <span className="frame-corner br" />
          </div>
          <p className="scratch-note reveal">{invite.scratch.note}</p>
        </div>
      </section>

      {invite.gallery.length > 0 && (
        <>
          <FloralDivider seed={8} />
          <section className="gallery-section section-pad">
            <div className="section-shell">
              <Heading eyebrow="Our story" title="Moments, softly held" />
              <Gallery items={invite.gallery} />
            </div>
          </section>
        </>
      )}

      <FloralDivider seed={11} />

      <section className="countdown-section section-pad">
        <div className="section-shell countdown-shell">
          <Heading eyebrow={invite.countdown.eyebrow} title={invite.countdown.title} />
          <Countdown target={invite.dateTime} />
        </div>
      </section>

      <FloralDivider seed={14} />

      <section className="program-section section-pad">
        <div className="section-shell program-shell">
          <Heading eyebrow={invite.program.eyebrow} title={invite.program.title} />
          <div className="timeline reveal">
            {invite.program.items.map((it) => (
              <article key={it.title}>
                <time>{it.time}</time>
                <div>
                  <h3>{it.title}</h3>
                  {it.note && <p>{it.note}</p>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FloralDivider seed={17} />

      <section className="venue-section section-pad">
        <div className="section-shell">
          <div className="venue-card reveal">
            <span className="eyebrow">The venue</span>
            <div className="venue-divider">
              <span>✦</span>
            </div>
            <h2>{invite.venue.name}</h2>
            <p>{invite.venue.address}</p>
            <a className="venue-map-button" href={invite.venue.mapUrl} target="_blank" rel="noreferrer">
              View on Google Maps
            </a>
          </div>
        </div>
      </section>

      <FloralDivider seed={20} />

      <section className="dress-section section-pad">
        <div className="section-shell dress-shell">
          <div className="dress-copy reveal">
            <span className="eyebrow">Dress code</span>
            <h2>{invite.dress.title}</h2>
            <p>{invite.dress.body}</p>
          </div>
          <div className="palette reveal">
            {invite.dress.palette.map((c) => (
              <i key={c} style={{ background: c }} />
            ))}
          </div>
        </div>
      </section>

      {invite.events.length > 0 && (
        <>
          <FloralDivider seed={23} />
          <section className="events-section section-pad">
            <div className="section-shell">
              <Heading eyebrow="The Festivities" title="Days filled with joy" />
              <div className="event-list reveal">
                {invite.events.map((ev) => (
                  <article key={ev.title}>
                    <h3>{ev.title}</h3>
                    <p>
                      <span>{ev.date}</span> <span>⬩</span> <span>{ev.time}</span>
                    </p>
                    <small>{ev.place}</small>
                    {ev.mapUrl && (
                      <a className="event-map-link" href={ev.mapUrl} target="_blank" rel="noreferrer">
                        View on Google Maps
                      </a>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      <FloralDivider seed={26} />

      <section className="gifts-section section-pad">
        <div className="gift-bloom" />
        <div className="gift-copy reveal">
          <span className="eyebrow">{invite.gifts.eyebrow}</span>
          <h2>{invite.gifts.title}</h2>
          <p>{invite.gifts.body}</p>
        </div>
      </section>

      <FloralDivider seed={29} />

      <footer className="closing-section">
        <div className="closing-arch reveal">
          <span className="ornament light">
            <i />
          </span>
          <h2>{invite.closing.title}</h2>
          <div className="closing-names">
            <Names />
          </div>
          <small>
            {longDate} · {invite.venue.name}
          </small>
        </div>
      </footer>
    </main>
  );
}
