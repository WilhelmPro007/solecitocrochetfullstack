import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/providers/SessionProvider";
import MyMelodyNavbar from "@/components/navbar/MyMelodyNavbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Exportar metadata en un componente separado para evitar conflictos con 'use client'
const metadata: Metadata = {
  title: "Solecito Crochet - Tienda de Productos Tejidos",
  description: "Descubre nuestra hermosa colección de productos tejidos a mano con amor",
};

// Exportar metadatos como una constante separada
export { metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <MyMelodyNavbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
