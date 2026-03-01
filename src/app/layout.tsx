import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Construction OS – Construct-All Corp",
  description: "The operating system for Construct-All Corporation's projects, clients, and field operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
