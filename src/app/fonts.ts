import localFont from "next/font/local";

// Loaded locally from @fontsource-variable packages (no Google Fonts at build time).
export const heading = localFont({
  src: "../../node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2",
  variable: "--font-heading",
  weight: "300 700",
  display: "swap",
});

export const body = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-italic.woff2",
      style: "italic",
    },
  ],
  variable: "--font-body",
  weight: "200 800",
  display: "swap",
});
