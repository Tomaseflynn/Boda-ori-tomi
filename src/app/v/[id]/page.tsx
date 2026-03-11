'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import invitados from '@/data/invitados.json';
import Image from 'next/image';

type Invitado = {
  id: string;
  nombre: string;
  pases: number;
};

// Define las props del componente de la página
export default function InvitadoPage() {
  const params = useParams();
  const id = params?.id as string;

  const [datosInvitado, setDatosInvitado] = useState<Invitado | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Estados para el formulario
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [asistencia, setAsistencia] = useState('');
  const [restriccion, setRestriccion] = useState('');
  const [alergias, setAlergias] = useState('');
  const [bebidas, setBebidas] = useState('');

  const [currentPase, setCurrentPase] = useState(1);
  const [allResponses, setAllResponses] = useState<any[]>([]);

  const restriccionOptions = [
    'Ninguna',
    'Vegetariano',
    'Vegano',
    'Celíaco',
  ];

  useEffect(() => {
    if (id) {
      // The 'invitados.json' is an object of objects, not an array.
      // We need to convert it into an array to use .find()
      const invitadosArray = Object.keys(invitados).map(key => ({
        id: key,
        ...(invitados as any)[key]
      }));

      const invitadoEncontrado = invitadosArray.find(inv => inv.id === id);

      if (invitadoEncontrado) {
        setDatosInvitado(invitadoEncontrado);
      } else {
        setError('La invitación no es válida. Por favor, verificá el link.');
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
      
        // Combine restriction and allergy fields
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
      
          const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSe9YQMx7pJ7roFnvzgB353ytHGRUEOI_339DoK6--8r9jtZwg/formResponse';
      
          // Correct Entry IDs from your form's source code
          const entryIds = {
            nombre: 'entry.757304647',
            asistencia: 'entry.404868253',
            restricciones: 'entry.1985028282', // Combined field for restrictions
            bebidas: 'entry.450490978',
          };
      
          const submissionPromises = finalResponses.map(response => {
            const formData = new FormData();
            formData.append(entryIds.nombre, response.nombre);
            formData.append(entryIds.asistencia, response.asistencia);
            formData.append(entryIds.restricciones, response.restriccion); // Submit combined data
            formData.append(entryIds.bebidas, response.bebidas);
      
            return fetch(googleFormUrl, {
              method: 'POST',
              body: formData,
              mode: 'no-cors' 
            });
          });
      
          try {
            await Promise.all(submissionPromises);
            setShowForm(false);
            setFormSubmitted(true);
          } catch (error) {
            console.error("Error submitting to Google Form:", error);
          } finally {
            setIsSubmitting(false);
          }
        }
      };

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-stone-100 text-stone-800 font-serif">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  if (!datosInvitado) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-stone-100">
        <p className="text-stone-500 animate-pulse">Cargando invitación...</p>
      </main>
    );
  }

  return (
    <main className="bg-stone-100 text-stone-800 font-serif">
      {/* --- SECCIÓN 1: PORTADA --- */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center -mt-16">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: "url('/fondo-papel.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-stone-100 via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
          <div className="animate-fade-in-up">
            <Image
              src="/logo-portada.png"
              alt="Nombres de los novios"
              width={500}
              height={300}
              className="object-contain"
            />
          </div>
          <p className="text-2xl md:text-3xl tracking-[0.4em] uppercase font-light text-stone-600 mt-2 mb-5 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            23 de Noviembre 2024
          </p>
        </div>
      </section>

      {/* --- SECCIÓN 2: CEREMONIA Y FIESTA --- */}
      <section className="py-20 px-6">
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto items-center">
          <div className="text-center space-y-4 animate-fade-in-up">
            <Image src="/icono-ceremonia.svg" alt="Ceremonia" width={80} height={80} className="mx-auto" />
            <h3 className="text-[28px] md:text-[32px] tracking-[5px] uppercase font-light text-stone-800 mt-2 mb-2">Ceremonia</h3>
            <p className="text-stone-500 font-light text-lg">
              16:00 hs
            </p>
            <p className="font-semibold text-stone-700 text-xl">
              Capilla del Colegio <br />Nuestra Señora del Huerto
            </p>
            <p className="text-stone-500 font-light text-lg px-4">
              Av.ellaneda 451, CABA
            </p>
            <a 
              href="https://maps.app.goo.gl/TUQ3a3fUjucqZJkP6" 
              target="_blank"
              className="btn-custom"
            >
              VER UBICACIÓN
            </a>
          </div>
          <div className="text-center space-y-4 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <Image src="/icono-fiesta.svg" alt="Fiesta" width={80} height={80} className="mx-auto" />
            <h3 className="text-[28px] md:text-[32px] tracking-[5px] uppercase font-light text-stone-800 mt-2 mb-2">Fiesta</h3>
            <p className="text-stone-500 font-light text-lg">
              18:00 hs
            </p>
            <p className="font-semibold text-stone-700 text-xl">
              Palacio Leloir
            </p>
            <p className="text-stone-500 font-light text-lg px-4">
              Gdor. Udaondo 2399, Ituzaingó
            </p>
            <a 
              href="https://maps.app.goo.gl/G4KqefkYvHSxfmGHA" 
              target="_blank"
              className="btn-custom"
            >
              VER UBICACIÓN
            </a>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN 3: REGALOS --- */}
      <section className="py-20 text-center px-6 bg-stone-200/50">
        <div className="max-w-md mx-auto space-y-6 animate-fade-in-up">
          <Image src="/icono-regalo.svg" alt="Regalo" width={60} height={60} className="mx-auto" />
          <h4 className="text-[24px] md:text-[32px] tracking-[5px] uppercase font-light text-stone-800 mt-2 mb-5">
            Regalo
          </h4>
          <p className="text-stone-800 font-light text-lg px-4">
          Lo más importante es que nos acompañes en este gran día, pero si querés ayudarnos con la luna de miel, te dejamos los datos de nuestra cuenta.
          </p>
          <div className="bg-white p-6 rounded-lg shadow-sm text-left">
            <p className="font-semibold">CBU: 0000003100092348192381</p>
            <p className="font-semibold">Alias: BODA.PEYY.LU</p>
            <p className="mt-2">Titular: Peyrano, Lucía</p>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN 4: CONFIRMAR ASISTENCIA --- */}
      <section className="py-20 text-center px-6">
        <div className="max-w-md md:max-w-[50%] mx-auto space-y-8 animate-fade-in-up">
          <h4 className="text-[24px] md:text-[32px] tracking-[5px] uppercase font-light text-stone-800 mt-2 mb-5">
            Confirmación de Asistencia
          </h4>
          <p className="text-stone-800 font-light text-lg px-4">
            Esperamos que seas parte de este día tan especial para nosotros. <br />Por favor, confirmá tu asistencia antes del 15 de Abril.
          </p>
          <button
            onClick={handleOpenForm}
            className="btn-custom"
          >
            CONFIRMAR ASISTENCIA
          </button>
        </div>
        
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
                      <div className="flex flex-wrap gap-x-4 gap-y-2">
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
                Todas las respuestas han sido enviadas.
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

      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 text-center opacity-40">
        <p className="text-[10px] uppercase tracking-[0.4em] text-stone-500 font-extralight px-6">
          ID: {id} • Invitación personal para {datosInvitado.pases} personas
        </p>
                <p className="text-[10px] uppercase tracking-[0.4em] text-stone-500 font-extralight px-6">
      V. 21.22
        </p>
      </footer>
    </main>
  );
}
