import { Inter, Space_Grotesk, Space_Mono } from "next/font/google";

// Brand typography (brand.md): Space Grotesk for titles and numbers, Inter for
// interface text. Space Mono is the utility face for episode codes ("S1·E4").

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const fontVariables = `${spaceGrotesk.variable} ${inter.variable} ${spaceMono.variable}`;
