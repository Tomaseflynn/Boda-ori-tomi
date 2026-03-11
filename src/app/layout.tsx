"use client";

import { useEffect } from "react";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google"; //
import "./globals.css";

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
  useEffect(() => {
    console.log(
      "%c✨ ¡Hola programador(a)! ✨",
      "color: #ff69b4; font-size: 16px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);"
    );
    console.log(
      "%cSi estás acá, sos parte especial de nuestra boda 💕",
      "color: #8b5a8e; font-size: 14px; font-style: italic;"
    );
    console.log(
      "%cHecho por Tomi, Ori y Gemini, con mucho amor ❤️",
      "color: #4a4a4a; font-size: 12px;"
    );
  }, []);

  return (
    <html lang="es">
      {/* 🕵️ Psst... si estás leyendo esto, ¡Sos bienvenido(a) a nuestro mundo! Ori & Tomi 💕 */}
      {/* Aplicamos la variable de la fuente al body */}
      <body className={`${montserrat.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}