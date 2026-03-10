'use client';
import { useState } from 'react';
import invitadosData from '@/data/invitados.json';

interface Invitado {
  nombre: string;
  pases: number;
  mensaje: string;
}

const ConfirmarAsistenciaPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const datosInvitado = (invitadosData as Record<string, Invitado>)[id];

  const [respuestas, setRespuestas] = useState<any[]>(() => {
    if (datosInvitado) {
      return Array(datosInvitado.pases).fill({ nombre: '', restricciones: '' });
    }
    return [];
  });

  const handleInputChange = (index: number, field: string, value: string) => {
    const nuevasRespuestas = [...respuestas];
    nuevasRespuestas[index] = { ...nuevasRespuestas[index], [field]: value };
    setRespuestas(nuevasRespuestas);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const G_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSchIBgCPL1erJiE2TAOjGB-1XD4ly4WsTT2so8J-IrE07vZ1Q/formResponse";
    const G_FORM_FIELDS = {
      nombre: 'entry.1111111111',
      restricciones: 'entry.2222222222',
    };
    const formData = new FormData();
    respuestas.forEach((respuesta) => {
      formData.append(G_FORM_FIELDS.nombre, respuesta.nombre);
      formData.append(G_FORM_FIELDS.restricciones, respuesta.restricciones);
    });
    fetch(G_FORM_URL, {
      method: 'POST',
      body: formData,
      mode: 'no-cors',
    })
      .then(() => {
        alert('¡Gracias por confirmar!');
        window.location.href = `/v/${id}`;
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Hubo un error al enviar la respuesta.');
      });
  };

  if (!datosInvitado) {
    return (
      <div className="flex h-screen items-center justify-center font-montserrat text-stone-400">
        Invitación no encontrada...
      </div>
    );
  }

  return (
    <main
      className="min-h-screen text-[#4a4a4a] font-montserrat antialiased relative"
      style={{
        backgroundImage: 'url(/fondo_papel.jpeg)',
        backgroundSize: '500px',
        backgroundRepeat: 'repeat',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-md md:max-w-[50%] mx-auto space-y-8 animate-fade-in-up py-20 text-center px-6">
        <h4 className="text-[24px] md:text-[32px] tracking-[5px] uppercase font-light text-stone-800 mt-2 mb-5">
          Confirmación de Asistencia
        </h4>
        <p className="text-stone-800 font-light text-lg px-4">
          Por favor, completá los datos de las personas que asistirán.
        </p>
        <form onSubmit={handleSubmit}>
          {respuestas.map((_, index) => (
            <div key={index} className="mb-4">
              <h5 className="text-stone-800 font-light text-lg px-4">Pase {index + 1}</h5>
              <input
                type="text"
                placeholder="Nombre y Apellido"
                onChange={(e) => handleInputChange(index, 'nombre', e.target.value)}
                className="w-full p-2 border border-stone-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Restricciones alimentarias"
                onChange={(e) => handleInputChange(index, 'restricciones', e.target.value)}
                className="w-full p-2 border border-stone-300 rounded-md mt-2"
              />
            </div>
          ))}
          <button type="submit" className="btn-custom">
            ENVIAR CONFIRMACIÓN
          </button>
        </form>
      </div>
    </main>
  );
};

export default ConfirmarAsistenciaPage;
