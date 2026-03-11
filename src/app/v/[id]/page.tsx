"use client";

import { useState, useEffect } from 'react';
import invitadosData from '@/data/invitados.json';
import RsvpForm from '@/components/RsvpForm';

interface Invitado {
  nombre: string;
  pases: number;
  mensaje: string;
}

// El parámetro `params` puede ser una promesa, así que lo manejamos como `any`
export default function InvitacionPersonalizada({ params }: { params: any }) {
  const [id, setId] = useState<string | null>(null);
  const [datosInvitado, setDatosInvitado] = useState<Invitado | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Estados del Modal y Formulario
  const [showCbu, setShowCbu] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // --- PASO 1: Obtener el ID desde los parámetros (que pueden ser una promesa) ---
  useEffect(() => {
    // Esta función maneja la lógica, sea una promesa o un objeto directo.
    const resolveParams = async () => {
      try {
        const resolvedParams = await params;
        if (resolvedParams && resolvedParams.id) {
          setId(resolvedParams.id);
        } else {
          // Si no hay ID, no podemos continuar.
          setError('ID de invitación no encontrado en la URL.');
        }
      } catch (e) {
        setError('Error al resolver los parámetros de la página.');
      }
    };
    resolveParams();
  }, [params]);

  // --- PASO 2: Una vez que tenemos el ID, buscar los datos del invitado ---
  useEffect(() => {
    // Este efecto se ejecuta solo si el `id` cambia (es decir, después del PASO 1)
    if (id) {
      const dataKeys = Object.keys(invitadosData);
      // Búsqueda sin distinguir mayúsculas/minúsculas
      const matchingKey = dataKeys.find(key => key.toLowerCase() === id.toLowerCase());
      
      if (matchingKey) {
        const invitado = (invitadosData as Record<string, Invitado>)[matchingKey];
        setDatosInvitado(invitado);
      } else {
        setError('Invitación no encontrada...');
      }
    }
  }, [id]);

  const handleOpenForm = () => {
    setFormSubmitted(false);
    setShowForm(true);
  };

  // Si hubo un error en cualquier punto, lo mostramos.
  if (error) return (
    <div className="flex h-screen items-center justify-center font-montserrat text-stone-400">
      {error}
    </div>
  );

  // Mientras no tengamos los datos del invitado, mostramos el estado de carga.
  if (!datosInvitado) return (
    <div className="flex h-screen items-center justify-center font-montserrat text-stone-400">
      Cargando invitación...
    </div>
  );

  return (
    <main 
      className="min-h-screen text-[#4a4a4a] font-montserrat antialiased relative"
      style={{ 
        backgroundImage: 'url(/fondo_papel.jpeg)', 
        backgroundSize: '500px', 
        backgroundRepeat: 'repeat',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center'
      }}
    >
      
      {/* --- SECCIÓN 1: PORTADA --- */}
      <section className="relative flex h-screen flex-col items-center justify-center text-center px-6 pt-6 overflow-hidden">
        <div className="flex flex-col items-center animate-fade-in-portada mt-[-5vh]">
          <img 
            src="/Proyecto_nuevo.png" 
            alt="Ori & Tomi" 
            className="w-full max-w-[280px] md:max-w-[420px] h-auto mb-4" 
          />
          <div className="mt-4 space-y-3 animate-fade-in-up">
            <p className="uppercase tracking-[0.3em] text-[15px] md:text-[20px] text-stone-400">
              ¡Hola {datosInvitado.nombre}!
            </p>
            <p className="text-stone-500 font-light text-lg md:text-xl max-w-[260px] md:max-w-xs mx-auto leading-relaxed border-t border-stone-200/50 pt-4">
              "{datosInvitado.mensaje}"
            </p>
          </div>
        </div>
        <div className="scroll-down"></div> 
      </section>

      {/* --- SECCIÓN 2: LOGÍSTICA --- */}
      <section className="bg-[var(--color-fondo-logistica)] py-10 md:py-15 shadow-sm">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-15 items-start">
            
            {/* Componente: Ceremonia */}
            <article className="flex flex-col items-center text-center space-y-0 animate-fade-in-up">
              <img src="/capilla_1.png" alt="Ceremonia" className="w-32 md:w-40 h-auto" />
              <h4 className="text-[24px] md:text-[32px] tracking-[5px] uppercase font-light text-stone-800 mt-2 mb-5">
                Ceremonia
              </h4>
              <div className="space-y-2 text-stone-500 font-light leading-relaxed">
                <p className="text-lg text-stone-900 font-medium ">2 de Mayo <br/> 17:00 hs.</p>
                <p>Parroquia Santa Ana <br/> Tandil, Buenos Aires.</p>
                <p className="text-xs italic opacity-70">Comenzará Puntual.</p>
              </div>
              <a 
                href="https://maps.app.goo.gl/ZVk8Qi21Le8ayyzy8" 
                target="_blank" 
                className="btn-custom mt-1"
              >
                Como llegar a la ceremonia
              </a>
            </article>

            {/* Componente: Fiesta */}
            <article className="flex flex-col items-center text-center space-y-0 animate-fade-in-up">
              <img src="/bola_fiesta.png" alt="Fiesta" className="w-32 md:w-40 h-auto" />
              <h4 className="text-[24px] md:text-[32px] tracking-[5px] uppercase font-light text-stone-800 mt-2 mb-5">
                Fiesta
              </h4>
              <div className="space-y-2 text-stone-500 font-light leading-relaxed">
                <p className="text-stone-800 font-medium text-lg">Después de la ceremonia<br/> 19:00 hs</p>
                <p>Tandil Golf Club <br/> ¡Te esperamos!</p>
              </div>
              <a 
                href="https://maps.app.goo.gl/FL3RXe3LoEjSxVLM8" 
                target="_blank" 
                className="btn-custom mt-1"
              >
                Llegar a la fiesta
              </a>
            </article>

          </div>
        </div>
      </section>

      {/* --- SECCIÓN 3: REGALOS --- */}
      <section className="bg-[var(--color-fondo-regalo)] py-10 text-center px-6">
        <div className="max-w-md mx-auto space-y-8 animate-fade-in-up">
          <img src="/regalito_blanco_2.png" className="w-34 mx-auto" alt="Regalo" />
          <p className="text-white font-light text-lg italic px-4">
            Tu presencia es nuestro mejor regalo, pero si querés colaborar con nuestro proyecto de vida juntos, aquí te dejamos los datos.
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Cuenta ARS */}
                  <div>
                    <p><span className="mb-1 block text-[9px] text-stone-300">Moneda</span> ARS</p>
                    <p><span className="mb-1 block text-[9px] text-stone-300">Titular</span> Tomas Elias, Flynn. y Oriana, Di Carlo</p>
                    <p><span className="mb-1 block text-[9px] text-stone-300">CBU</span> 0140339603630258941908</p>
                    <p><span className="mb-1 block text-[9px] text-stone-300">Alias</span> TOMI.ORI.ARS</p>
                    <p><span className="mb-1 block text-[9px] text-stone-300">Banco</span> BANCO PROVINCIA BS.AS.</p>
                  </div>
                  {/* Cuenta USD */}
                  <div>
                    <p><span className="mb-1 block text-[9px] text-stone-300">Moneda</span> USD</p>
                    <p><span className="mb-1 block text-[9px] text-stone-300">Titular</span>Tomas Elias, Flynn. y Oriana, Di Carlo</p>
                    <p><span className="mb-1 block text-[9px] text-stone-300">CBU</span> 0140339604630252128632</p>
                    <p><span className="mb-1 block text-[9px] text-stone-300">Alias</span> TOMI.ORI.USD</p>
                    <p><span className="mb-1 block text-[9px] text-stone-300">Banco</span> BANCO PROVINCIA BS.AS.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* --- SECCIÓN 4: CONFIRMAR ASISTENCIA --- */}
      <section className="py-20 text-center px-6">
        <div className="max-w-md md:max-w-[50%] mx-auto space-y-8 animate-fade-in-up">
          <h4 className="text-[24px] md:text-[32px] tracking-[5px] uppercase font-light text-stone-800 mt-2 mb-5">
          Confirmación de Asistencia
          </h4>
          <p className="text-stone-800 font-light text-lg px-4">
            Esperamos que seas parte de este día tan especial para nosotros. <br/>Por favor, confirmá tu asistencia antes del 15 de Abril.
          </p>
          <button onClick={handleOpenForm} className="btn-custom">
            CONFIRMAR ASISTENCIA
          </button>
        </div>
      </section>
      
      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-all">
          <RsvpForm
            totalPases={datosInvitado.pases}
            invitacionId={id}
            onClose={() => setShowForm(false)}
            onSuccess={() => {
              setShowForm(false);
              setFormSubmitted(true);
            }}
          />
        </div>
      )}

      {/* SUCCESS MODAL */}
      {formSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-all">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-10 shadow-2xl animate-fade-in-up text-center">
            <h5 className="mb-4 font-montserrat italic text-2xl text-stone-800">
              ¡Gracias por confirmar!
            </h5>
            <p className="text-stone-500">
              Tu confirmación ha sido enviada con éxito.
            </p>
            <button
              onClick={() => setFormSubmitted(false)}
              className="btn-custom mt-6"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="py-12 text-center opacity-40">
         <p className="text-[10px] uppercase tracking-[0.4em] text-stone-500 font-extralight px-6">
            ID: {id} • Invitación personal para {datosInvitado.pases} personas
         </p>
      </footer>

    </main>
  );
}