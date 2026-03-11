import React, { useState, useRef } from 'react';

interface LogoEasterEggProps {
  src: string;
  alt: string;
  className: string;
}

export default function LogoEasterEgg({ src, alt, className }: LogoEasterEggProps) {
  const [clickCount, setClickCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    setClickCount(prev => prev + 1);

    if (clickCount + 1 === 5) {
      triggerEasterEgg();
      setClickCount(0);
    } else {
      // Reset el contador después de 2 segundos sin clics
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setClickCount(0);
      }, 2000);
    }
  };

  const triggerEasterEgg = () => {
    setShowConfetti(true);
    // Crear corazones/confeti que caen
    createConfetti();
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };

  const createConfetti = () => {
    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement('div');
      confetti.innerHTML = '💕';
      confetti.style.position = 'fixed';
      confetti.style.left = Math.random() * window.innerWidth + 'px';
      confetti.style.top = '-10px';
      confetti.style.fontSize = (10 + Math.random() * 20) + 'px';
      confetti.style.pointerEvents = 'none';
      confetti.style.zIndex = '9999';
      confetti.style.opacity = '1';
      confetti.style.transition = 'all 3s ease-in';
      
      document.body.appendChild(confetti);

      // Animar caída
      setTimeout(() => {
        confetti.style.top = window.innerHeight + 'px';
        confetti.style.opacity = '0';
      }, 10);

      // Remover del DOM
      setTimeout(() => {
        confetti.remove();
      }, 3000);
    }
  };

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`${className} cursor-pointer hover:opacity-80 transition-opacity`}
        onClick={handleClick}
        title={clickCount > 0 ? `${5 - clickCount} clic${5 - clickCount !== 1 ? 's' : ''} más...` : ''}
      />
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-[9998] animate-pulse">
          <span className="text-6xl animate-bounce">✨💕✨</span>
        </div>
      )}
    </>
  );
}
