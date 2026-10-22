# Sabeen & Luqman — Engagement Invitation

A tap-to-open digital invitation built with Next.js 16 + Motion.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static production build
```

## Editing the details

Everything guests read lives in **`lib/invite.ts`**: names, parents, date & time,
venue + Google Maps link, programme, dress code, closing line.

- **Gallery** — drop photos in `public/gallery/` and list them in `gallery`
  (e.g. `{ src: "/gallery/01.jpg", caption: "Where it began" }`). Hidden while empty.
- **Other functions** (Mehndi, Nikah…) — add to `events`. Hidden while empty.
- **Music** — by default a soft harp/bell score is synthesised in the browser.
  To use your own song, put an mp3 in `public/audio/` and set `music: "/audio/your-song.mp3"`.

## What's where

| Path | |
| --- | --- |
| `components/Hero.tsx` | Closed curtains → tap → curtains part, chandelier lowers, candles light, text reveals |
| `components/art/*` | All artwork as hand-built SVG (chandelier, roses, drapes, valance, gilded scrolls) |
| `components/art/Bismillah.tsx` | ﷽ outline from Noto Nastaliq Urdu (SIL OFL 1.1) — identical on every phone |
| `components/ScratchCard.tsx` | Gold-foil scratch-to-reveal date + rose petal shower |
| `lib/music.ts` | Web Audio score + opening chime |
| `app/globals.css` | All styling |
# luqman-and-sabeen
