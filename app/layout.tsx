import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ujjwal — Developer Lab",
  description:
    "The personal engineering lab of Ujjwal, a computer science student and full-stack developer.",
  metadataBase: new URL("https://ujjwal.dev"),
};

// Applies the saved theme before the first paint so the page never flashes
// light on a dark-mode visit. Mirrors the toggle in app/page.tsx.
const themeScript = `(function(){try{var s=localStorage.getItem("theme");var d=window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.dataset.theme=s==="dark"||s==="light"?s:(d?"dark":"light");}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
