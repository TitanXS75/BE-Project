import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Learning — Curriculum-Aware AI Platform",
  description: "Local-first AI education platform with portable .rssh knowledge packages.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#090d16] text-slate-100">{children}</body>
    </html>
  );
}
