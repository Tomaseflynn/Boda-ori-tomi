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
    const G_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdsDQ0Q0jk74w5seBu26o2t_-ni7bOOS_eaISLez-fZYQ9gfw/formResponse";
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

'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import invitadosData from '@/data/invitados.json';

interface Invitado {
  nombre: string;
  pases: number;
  mensaje: string;
}

const ConfirmarAsistenciaPage = () => {
  const params = useParams();
  const id = params.id as string;

  const datosInvitado = (invitadosData as Record<string, Invitado>)[id];

  const [respuestas, setRespuestas] = useState<any[]>(() => {
    if (datosInvitado) {
      return Array(datosInvitado.pases).fill({ 
        nombre: '', 
        asistencia: 'Sí, asistiré',
        menu: 'Adulto',
        transporte: 'No, gracias',
        alergias: '',
        mensaje: ''
      });
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
    const G_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSe9YQMx7pJ7roFnvzgB353ytHGRUEOI_339DoK6--8r9jtZwg/formResponse";
    const G_FORM_FIELDS = {
      nombre: 'entry.1698799989',
      asistencia: 'entry.1148889311',
      menu: 'entry.1610928923',
      transporte: 'entry.1017833039',
      alergias: 'entry.1438344535',
      mensaje: 'entry.1632298288'
    };
    const formData = new FormData();
    respuestas.forEach((respuesta) => {
      formData.append(G_FORM_FIELDS.nombre, respuesta.nombre);
      formData.append(G_FORM_FIELDS.asistencia, respuesta.asistencia);
      formData.append(G_FORM_FIELDS.menu, respuesta.menu);
      formData.append(G_FORM_FIELDS.transporte, respuesta.transporte);
      formData.append(G_FORM_FIELDS.alergias, respuesta.alergias);
      formData.append(G_FORM_FIELDS.mensaje, respuesta.mensaje);
    });
    fetch(G_FORM_URL, {
      method: 'POST',
      body: formData,
      mode: 'no-cors',
    })
      .then(() => {
        alert('¡Gracias por tu respuesta!');
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
      style={{ backgroundColor: '#efeadd' }}
    >
      <div className="max-w-lg mx-auto space-y-8 animate-fade-in-up py-12 md:py-20 text-center px-6">
        <h4 className="text-3xl md:text-4xl tracking-widest uppercase font-light text-stone-800">
          Confirmación de Asistencia
        </h4>
        <p className="text-stone-700 font-light text-lg">
          Por favor, completá los datos de las personas que asistirán.
        </p>
        <form onSubmit={handleSubmit} className="space-y-10">
          {respuestas.map((_, index) => (
            <div key={index} className="p-6 border border-stone-300 rounded-lg bg-white/50 shadow-sm text-left">
              <h5 className="text-stone-800 font-medium text-xl mb-6 border-b border-stone-200 pb-3">
                Pase {index + 1}
              </h5>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">Nombre y Apellido</label>
                  <input
                    type="text"
                    placeholder="Ej: Juan Pérez"
                    onChange={(e) => handleInputChange(index, 'nombre', e.target.value)}
                    className="w-full p-3 border border-stone-300 rounded-md shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">Confirmación</label>
                  <select 
                    onChange={(e) => handleInputChange(index, 'asistencia', e.target.value)}
                    className="w-full p-3 border border-stone-300 rounded-md shadow-sm bg-white"
                  >
                    <option>Sí, asistiré</option>
                    <option>No podré asistir</option>
                  </select>
                </div>
                 <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">Elección de Menú</label>
                  <select 
                    onChange={(e) => handleInputChange(index, 'menu', e.target.value)}
                    className="w-full p-3 border border-stone-300 rounded-md shadow-sm bg-white"
                  >
                    <option>Adulto</option>
                    <option>Niño</option>
                    <option>Vegetariano</option>
                    <option>Celíaco</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">¿Necesitás transporte desde y hacia el hotel?</label>
                   <select 
                    onChange={(e) => handleInputChange(index, 'transporte', e.target.value)}
                    className="w-full p-3 border border-stone-300 rounded-md shadow-sm bg-white"
                  >
                    <option>No, gracias</option>
                    <option>Sí, por favor</option>
                  </select>
                </div>
                 <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">Alergias o restricciones alimentarias</label>
                  <textarea
                    placeholder="Ej: Alergia a las nueces"
                    onChange={(e) => handleInputChange(index, 'alergias', e.target.value)}
                    className="w-full p-3 border border-stone-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">Mensaje para los novios (opcional)</label>
                  <textarea
                    placeholder="Dejanos un lindo mensaje!"
                    onChange={(e) => handleInputChange(index, 'mensaje', e.target.value)}
                    className="w-full p-3 border border-stone-300 rounded-md shadow-sm"
                  />
                </div>
              </div>
            </div>
          ))}
          <button type="submit" className="btn-custom w-full max-w-xs mx-auto py-3 text-base">
            ENVIAR RESPUESTA
          </button>
        </form>
      </div>
    </main>
  );
};

export default ConfirmarAsistenciaPage;
