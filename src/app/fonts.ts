import localFont from "next/font/local";

// Loaded locally from @fontsource-variable packages (no Google Fonts at build time).
export const heading = localFont({
  src: "../../node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2",
  variable: "--font-heading",
  weight: "300 700",
  display: "swap",
});

export const body = localFont({
  // Latin subset, upright only (italics are rare; the browser slants the upright face).
  // Keeps the preload list to the two fonts the first screen needs.
  src: "../../node_modules/@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2",
  variable: "--font-body",
  weight: "200 800",
  display: "swap",
});
