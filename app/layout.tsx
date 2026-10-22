import type { Metadata, Viewport } from "next";
import { Allura, Cormorant_Infant, DM_Sans } from "next/font/google";
import Defs from "@/components/art/Defs";
import { VelvetDefs } from "@/components/art/Stage";
import { couple, coupleFirstNames, invite } from "@/lib/invite";
import "./globals.css";

const script = Allura({ weight: "400", subsets: ["latin"], variable: "--font-script", display: "swap" });
const display = Cormorant_Infant({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });

const names = coupleFirstNames;

export const metadata: Metadata = {
  title: `${names} — ${invite.occasion} Invitation`,
  description: `You are warmly invited to the ${invite.occasion.toLowerCase()} of ${couple.map((p) => `${p.first} ${p.last}`).join(" & ")}.`,
  openGraph: {
    title: `${names} — ${invite.occasion} Invitation`,
    description: "Tap to open your invitation.",
  },
};

export const viewport: Viewport = {
  themeColor: "#5a2238",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${script.variable} ${display.variable} ${body.variable}`}>
      <body className="intro-locked">
        <Defs />
        <VelvetDefs />
        {children}
      </body>
    </html>
  );
}
