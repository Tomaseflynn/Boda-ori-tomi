
"use client";

import { useState, useEffect } from 'react';
import invitadosData from '@/data/invitados.json';

interface Invitado {
  nombre: string;
  pases: number;
  mensaje: string;
}

export default function InvitacionPersonalizada({ params }: { params: { id: string } }) {
  const { id } = params;
  const [datosInvitado, setDatosInvitado] = useState<Invitado | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Estados del Modal y Formulario
  const [showCbu, setShowCbu] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Campos del formulario
  const [nombre, setNombre] = useState('');
  const [asistencia, setAsistencia] = useState('');
  const [restriccion, setRestriccion] = useState('');
  const [alergias, setAlergias] = useState('');
  const [bebidas, setBebidas] = useState('');

  const [currentPase, setCurrentPase] = useState(1);
  const [allResponses, setAllResponses] = useState<any[]>([]);

  const restriccionOptions = ['Ninguna', 'Vegetariano', 'Vegano', 'Celíaco'];

  useEffect(() => {
    if (id) {
      const invitado = (invitadosData as Record<string, Invitado>)[id];
      if (invitado) {
        setDatosInvitado(invitado);
      } else {
        setError('Invitación no encontrada...');
      }
    }
  }, [id]);

  const resetFormFields = () => {
    setNombre('');
    setAsistencia('');
    setRestriccion('');
    setAlergias('');
    setBebidas('');
  };

  const handleOpenForm = () => {
    setCurrentPase(1);
    setAllResponses([]);
    setFormSubmitted(false);
    resetFormFields();
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let fullRestriccion = restriccion;
    if (restriccion && restriccion !== 'Ninguna' && alergias) {
      fullRestriccion = `${restriccion}, ${alergias}`;
    } else if (alergias) {
      fullRestriccion = alergias;
    }

    const currentResponse = {
      nombre,
      asistencia,
      restriccion: asistencia === 'Si, confirmo' ? fullRestriccion : 'N/A',
      bebidas: asistencia === 'Si, confirmo' ? bebidas : 'N/A',
      invitacionId: id,
      paseNum: currentPase
    };

    if (currentPase < datosInvitado!.pases) {
      setAllResponses(prev => [...prev, currentResponse]);
      setCurrentPase(prev => prev + 1);
      resetFormFields();
      setIsSubmitting(false);
    } else {
      const finalResponses = [...allResponses, currentResponse];
      
      try {
        const response = await fetch('/api/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(finalResponses),
        });

        if (!response.ok) {
          throw new Error('Fallo en el envío');
        }

        setShowForm(false);
        setFormSubmitted(true);

      } catch (error) {
        console.error("Error submitting to API route:", error);
        // Aquí podrías mostrar un mensaje de error al usuario
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (error) return (
    <div className="flex h-screen items-center justify-center font-montserrat text-stone-400">
      {error}
    </div>
  );

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
                <p><span className="mb-1 block text-[9px] text-stone-300">CBU</span> 0140339604630252128632</p>
                <p><span className="mb-1 block text-[9px] text-stone-300">Alias</span> boda.ori.tomi</p>
                <p><span className="mb-1 block text-[9px] text-stone-300">Banco</span> BANCO PROVINCIA BS.AS.</p>
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
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowForm(false)}
              className="absolute right-5 top-5 text-stone-300 hover:text-stone-500 text-xl"
            >
              ✕
            </button>
            <h5 className="mb-6 border-b border-stone-100 pb-4 text-left font-montserrat italic text-2xl text-stone-800">
              Confirmación de Asistencia {datosInvitado.pases > 1 ? `(${currentPase} de ${datosInvitado.pases})` : ''}
            </h5>
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre y apellido *</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Asistencia *</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input type="radio" name="asistencia" value="Si, confirmo" required checked={asistencia === 'Si, confirmo'} onChange={(e) => setAsistencia(e.target.value)} className="mr-2"/>
                    Sí, confirmo
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="asistencia" value="No podré asistir" required checked={asistencia === 'No podré asistir'} onChange={(e) => setAsistencia(e.target.value)} className="mr-2"/>
                    No podré asistir
                  </label>
                </div>
              </div>

              {asistencia === 'Si, confirmo' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Restricciones alimentarias *</label>
                    <div className='flex flex-wrap gap-x-4 gap-y-2'>
                      {restriccionOptions.map(option => (
                         <label key={option} className="flex items-center">
                          <input type="radio" name="restriccion" value={option} required={asistencia === 'Si, confirmo'} checked={restriccion === option} onChange={e => setRestriccion(e.target.value)} className="mr-2"/>
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="alergias" className="block text-sm font-medium text-gray-700">
                    Alergias o más restricciones (opcional)
                    </label>
                    <input
                      id="alergias"
                      value={alergias}
                      onChange={(e) => setAlergias(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="bebidas" className="block text-sm font-medium text-gray-700">
                    ¿Qué bebidas no pueden faltar? *
                    </label>
                    <input
                      id="bebidas"
                      value={bebidas}
                      onChange={(e) => setBebidas(e.target.value)}
                       className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required={asistencia === 'Si, confirmo'}
                    />
                  </div>
                </>
              )}

              <button type="submit" disabled={isSubmitting} className="btn-custom w-full mt-4 disabled:opacity-50">
                 {isSubmitting ? 'Enviando...' : (currentPase < datosInvitado.pases ? 'Siguiente Invitado' : 'Enviar Confirmación')}
              </button>
            </form>
          </div>
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
