export const dynamic = 'force-dynamic';
export const revalidate = 0;

"use client";
import { useState, useEffect } from 'react';
import invitadosData from '@/data/invitados.json';

interface Invitado {
  nombre: string;
  pases: number;
  mensaje: string;
}

export default function InvitacionPersonalizada({ params }: { params: any }) {
  const [id, setId] = useState<string | null>(null);
  const [showCbu, setShowCbu] = useState(false);

  useEffect(() => {
    params.then((res: any) => setId(res.id));
  }, [params]);

  if (!id) return null;
  const datosInvitado = (invitadosData as Record<string, Invitado>)[id];

  if (!datosInvitado) return (
    <div className="flex h-screen items-center justify-center font-montserrat text-stone-400">
      Invitación no encontrada...
    </div>
  );

  return (
    <main 
      className="min-h-screen text-[#4a4a4a] font-montserrat antialiased relative"
      style={{ 
        backgroundImage: 'url(/fondo-papel.jpg)', 
        backgroundSize: 'cover', 
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center'
      }}
    >
      
{/* --- SECCIÓN 1: PORTADA --- */}
<section className="relative flex h-screen flex-col items-center justify-center text-center px-6 pt-6 overflow-hidden">
  {/* Contenedor principal con un poco menos de espacio superior para subir todo */}
  <div className="flex flex-col items-center animate-fade-in-portada mt-[-5vh]">
    
    {/* IMAGEN: Reducimos el max-width para que no ocupe tanto alto en vertical */}
    <img 
      src="/logo-portada.png" 
      alt="Ori & Tomi" 
      className="w-full max-w-[280px] md:max-w-[420px] h-auto mb-4" 
    />
    
    {/* BLOQUE DE TEXTO: Reducimos mt-8 a mt-4 y pt-6 a pt-4 */}
    <div className="mt-4 space-y-3 animate-fade-in-up">
      <p className="uppercase tracking-[0.3em] text-[10px] md:text-[12px] text-stone-400">
        ¡Hola {datosInvitado.nombre}!
      </p>
      <p className="italic text-stone-500 font-light text-sm md:text-base max-w-[260px] md:max-w-xs mx-auto leading-relaxed border-t border-stone-200/50 pt-4">
        "{datosInvitado.mensaje}"
      </p>
    </div>
  </div>

  {/* FLECHA: Asegurate que en globals.css tenga 'bottom: 20px' o similar para que no se pierda */}
  <div className="scroll-down"></div> 
</section>

      {/* --- SECCIÓN 2: LOGÍSTICA (Limpia y Escalable) --- */}
      <section className="bg-white py-10 md:py-15 shadow-sm">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-15 items-start">
            
            {/* Componente: Ceremonia */}
            <article className="flex flex-col items-center text-center space-y-0 animate-fade-in-up">
              <img src="/icono-ceremonia.svg" alt="Ceremonia" className="w-32 md:w-40 h-auto" />
              <h4 className="text-[24px] md:text-[28px] tracking-[5px] uppercase font-light text-stone-800 mt-2 mb-5">
                Ceremonia
              </h4>
              <div className="space-y-2 text-stone-500 font-light leading-relaxed">
                <p className="text-[17px] md:text-[19px] text-stone-900 font-medium italic">2 de Mayo <br/> 17:00 hs.</p>
                <p>Parroquia Santa Ana <br/> Tandil, Buenos Aires.</p>
                <p className="text-xs italic opacity-70">Recibí debajo las indicaciones para llegar.</p>
              </div>
              <a 
                href="http://maps..." 
                target="_blank" 
                className="btn-custom" // Definido en globals.css para reusar
              >
                Llegar a la ceremonia
              </a>
            </article>

            {/* Componente: Fiesta */}
            <article className="flex flex-col items-center text-center space-y-0 animate-fade-in-up">
              <img src="/icono-fiesta.svg" alt="Fiesta" className="w-32 md:w-40 h-auto" />
              <h4 className="text-[24px] md:text-[28px] tracking-[5px] uppercase font-light text-stone-800 mt-2 mb-5">
                Fiesta
              </h4>
              <div className="space-y-2 text-stone-500 font-light leading-relaxed">
                <p className="text-stone-800 font-medium italic text-lg">Después de la ceremonia</p>
                <p>Tandil Golf Club <br/> ¡Te esperamos!</p>
              </div>
              <a 
                href="http://maps..." 
                target="_blank" 
                className="btn-custom"
              >
                Llegar a la fiesta
              </a>
            </article>

          </div>
        </div>
      </section>

      {/* --- SECCIÓN 3: REGALOS --- */}
      <section className="bg-boda-primario py-20 text-center px-6">
        <div className="max-w-md mx-auto space-y-8 animate-fade-in-up">
          <img src="/icono-regalo.svg" className="w-32 mx-auto" alt="Regalo" />
          <p className="text-white font-light text-lg italic px-4">
            Si deseás realizarnos un regalo podés colaborar con nuestra Luna de Miel...
          </p>
          <button 
            onClick={() => setShowCbu(true)}
            className="btn-custom-alt"
          >
            VER DATOS BANCARIOS
          </button>
        </div>

        {/* Modal: Extraído lógicamente */}
        {showCbu && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-all">
            <div className="relative w-full max-w-sm rounded-2xl bg-white p-10 shadow-2xl animate-fade-in-up">
              <button 
                onClick={() => setShowCbu(false)} 
                className="absolute right-5 top-5 text-stone-300 hover:text-stone-500 text-xl"
              >✕</button>
              <h5 className="mb-8 border-b border-stone-100 pb-4 text-left font-montserrat italic text-2xl text-stone-800">
                Datos Bancarios
              </h5>
              <div className="space-y-5 text-left text-xs uppercase tracking-widest text-stone-600 font-light">
                <p><span className="mb-1 block text-[9px] text-stone-300">Titular</span> Oriana y Tomas</p>
                <p><span className="mb-1 block text-[9px] text-stone-300">CBU</span> 000000310001234567890</p>
                <p><span className="mb-1 block text-[9px] text-stone-300">Alias</span> boda.ori.tomi</p>
                <p><span className="mb-1 block text-[9px] text-stone-300">Banco</span> Galicia</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 text-center opacity-40">
         <p className="text-[10px] uppercase tracking-[0.4em] text-stone-500 font-extralight px-6">
            ID: {id} • Invitación personal para {datosInvitado.pases} personas
         </p>
      </footer>

    </main>
  );
}