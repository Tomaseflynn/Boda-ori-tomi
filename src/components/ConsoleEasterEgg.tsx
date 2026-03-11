"use client";

import { useEffect } from "react";

export default function ConsoleEasterEgg() {
  useEffect(() => {
    console.log(
      "%c✨ ¡Hola programador(a)! ✨",
      "color: #ff69b4; font-size: 16px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);"
    );
    console.log(
      "%cSi estás acá, sos parte especial de nuestra boda 💕",
      "color: #8b5a8e; font-size: 16px; font-style: italic;"
    );
    console.log(
      "%cHecho por Tomi, Ori y Gemini, con mucho amor ❤️",
      "color: #5b6b15; font-size: 16px;"
    );
  }, []);

  return null;
}
