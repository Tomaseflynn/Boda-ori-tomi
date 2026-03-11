import type { Metadata } from "next";
import { Montserrat } from "next/font/google"; //
import "./globals.css";
import ConsoleEasterEgg from "@/components/ConsoleEasterEgg";

// Configuramos Montserrat con los pesos que usa tu styles.css (300, 400, 600, 900)
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat", // Creamos una variable CSS
  weight: ["300", "400", "600", "900"],
});

export const metadata: Metadata = {
  title: "Invitación Boda - Ori & Tomi",
  icons: {
    icon: "favicon.ico",
    shortcut: "favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      {/* 🕵️ Psst... si estás leyendo esto, ¡Sos bienvenido(a) a nuestro mundo! Ori & Tomi 💕 */}
      {/* Aplicamos la variable de la fuente al body */}
      <body className={`${montserrat.variable} antialiased`}>
        <ConsoleEasterEgg />
        {children}
      </body>
    </html>
  );
}