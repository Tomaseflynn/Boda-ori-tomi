import React, { useState } from 'react';
import useMultiPase, { ResponseRow } from '@/hooks/useMultiPase';

interface RsvpFormProps {
  totalPases: number;
  invitacionId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

const restriccionOptions = ['Ninguna', 'Vegetariano', 'Vegano', 'Celíaco'];

export default function RsvpForm({
  totalPases,
  invitacionId,
  onClose,
  onSuccess,
}: RsvpFormProps) {
  const { currentPase, reset, addResponse, submitAll } = useMultiPase(totalPases);

  const [nombre, setNombre] = useState('');
  const [asistencia, setAsistencia] = useState('');
  const [restriccion, setRestriccion] = useState('');
  const [alergias, setAlergias] = useState('');
  const [bebidas, setBebidas] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetFormFields = () => {
    setNombre('');
    setAsistencia('');
    setRestriccion('');
    setAlergias('');
    setBebidas('');
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

    const currentResponse: ResponseRow = {
      nombre,
      asistencia,
      restriccion: asistencia === 'Si, confirmo' ? fullRestriccion : 'N/A',
      bebidas: asistencia === 'Si, confirmo' ? bebidas : 'N/A',
      invitacionId,
      paseNum: currentPase,
    };

    const finished = addResponse(currentResponse);

    if (!finished.finished) {
      resetFormFields();
      setIsSubmitting(false);
      return;
    }

    // Si llegamos al último pase, mandamos todo con el nuevo array de respuestas
    try {
      await submitAll(finished.responses);
      onSuccess();
    } catch (err) {
      console.error('Error submitting to API route:', err);
      // podrías mostrar un mensaje al usuario aquí
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute right-5 top-5 text-stone-300 hover:text-stone-500 text-xl"
      >
        ✕
      </button>
      <h5 className="mb-6 border-b border-stone-100 pb-4 text-left font-montserrat italic text-2xl text-stone-800">
        Confirmación de Asistencia {totalPases > 1 ? `(${currentPase} de ${totalPases})` : ''}
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
          {isSubmitting ? 'Enviando...' : (currentPase < totalPases ? 'Siguiente Invitado' : 'Enviar Confirmación')}
        </button>
      </form>
    </div>
  );
}
