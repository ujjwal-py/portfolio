import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ujjwal — Developer Lab",
  description:
    "The personal engineering lab of Ujjwal, a computer science student and full-stack developer.",
  metadataBase: new URL("https://ujjwal.dev"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
