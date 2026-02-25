import type { Metadata } from "next";
import { Syne, Space_Mono } from "next/font/google";
import "./globals.css";

// Importation et configuration de la police Syne
const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

// Importation et configuration de la police Space Mono
const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Davy Karim | Développeur",
  description: "Portfolio de Tchouka Davy Karim, Développeur Python, Web et Desktop basé à Douala.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${syne.variable} ${spaceMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}