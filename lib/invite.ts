// Every word on the invitation lives here. Edit this file to change names,
// date, venue, programme, etc. — no need to touch the components.

export type Person = {
  first: string;
  last: string;
  relation: string; // "Daughter of" / "Son of"
  parents: string;
  grandparents?: string;
};

export type ProgramItem = { time: string; title: string; note?: string };
export type EventItem = { title: string; date: string; time: string; place: string; mapUrl?: string };
export type GalleryItem = { src: string; caption?: string };

export const invite = {
  occasion: "Engagement",

  bismillahTranslation: "", // e.g. "In the name of Allah, the Most Gracious, the Most Merciful"

  welcomeLine: "We request the honour of your\npresence at the Engagement of",
  closingLine: "as they take their first step towards\nforever, in faith and love.",

  bride: {
    first: "Sabeen",
    last: "Khan",
    relation: "Daughter of",
    parents: "Mr. & Mrs. Khan",
  } as Person,

  groom: {
    first: "Luqman",
    last: "Ahmed Adil",
    relation: "Son of",
    parents: "Mr. & Mrs. Adil",
  } as Person,

  // ISO date with your timezone offset (Pakistan +05:00, India +05:30)
  dateTime: "2026-12-20T19:00:00+05:00",
  timeZone: "Asia/Karachi",
  timeLabel: "07:00 PM",

  welcome: {
    title: "A Blessed Beginning",
    body: "With hearts full of gratitude, we warmly invite you to join us as we celebrate the engagement of our beloved children — a promise made with love, blessed by family, and sealed with a ring.",
  },

  scratch: {
    eyebrow: "A date to hold close",
    title: "Scratch to Reveal",
    kicker: "You’re Invited!",
    note: "Use your finger or cursor to uncover the moment.",
  },

  // Put photos in /public/gallery and list them here. Section hides when empty.
  gallery: [] as GalleryItem[],

  countdown: { eyebrow: "Until the rings are exchanged", title: "Counting every heartbeat" },

  program: {
    eyebrow: "The celebration",
    title: "Our Engagement day",
    items: [
      { time: "6:30 PM", title: "Guest Arrival", note: "Welcome & refreshments" },
      { time: "07:00 PM", title: "Ring Ceremony", note: "Exchange of rings & duas" },
      { time: "07:30 PM", title: "Blessings", note: "Family greetings & photographs" },
      { time: "08:00 PM", title: "Dinner", note: "A feast shared with love" },
    ] as ProgramItem[],
  },

  venue: {
    name: "The Grand Ballroom",
    address: "Venue address, City",
    mapUrl: "https://maps.google.com/?q=The+Grand+Ballroom",
  },

  dress: {
    title: "Festive Formal",
    body: "Traditional or formal attire is encouraged — sarees, lehengas, anarkalis, sherwanis and kurtas in rich jewel tones would be perfect for the evening.",
    palette: ["#3a070c", "#6f0b17", "#a51520", "#c9a35f", "#f1e3ce"],
  },

  // Other functions (Mehndi, Nikah…). Section hides when empty.
  events: [] as EventItem[],

  gifts: {
    eyebrow: "With all our hearts",
    title: "Your presence is our present",
    body: "Your love, blessings, and presence are the greatest gifts we could ever ask for.",
  },

  closing: { title: "We can’t wait to celebrate with you." },

  // Optional: drop an mp3 in /public/audio and set e.g. "/audio/music.mp3".
  // When null, a gentle romantic score is synthesised live in the browser.
  music: null as string | null,
};

export const eventDate = new Date(invite.dateTime);

export function formatLongDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: invite.timeZone });
}
export function formatWeekday(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "long", timeZone: invite.timeZone });
}
