import { useState } from 'react';

export interface ResponseRow {
  nombre: string;
  asistencia: string;
  restriccion: string;
  bebidas: string;
  invitacionId: string | null;
  paseNum: number;
}

export default function useMultiPase(totalPases: number) {
  const [currentPase, setCurrentPase] = useState(1);
  const [allResponses, setAllResponses] = useState<ResponseRow[]>([]);

  const addResponse = (response: ResponseRow) => {
    const updatedResponses = [...allResponses, response];
    setAllResponses(updatedResponses);

    if (currentPase < totalPases) {
      setCurrentPase(prev => prev + 1);
      return { finished: false, responses: updatedResponses }; // aún quedan pases
    } else {
      return { finished: true, responses: updatedResponses }; // se alcanzó el último pase
    }
  };

  const reset = () => {
    setCurrentPase(1);
    setAllResponses([]);
  };

  const submitAll = async (responsesToSubmit: ResponseRow[]) => {
    if (responsesToSubmit.length === 0) return null;
    console.log('Enviando respuestas acumuladas:', responsesToSubmit);
    
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(responsesToSubmit),
    });

    if (!response.ok) {
      throw new Error('Fallo en el envío');
    }

    return response.json();
  };

  return {
    currentPase,
    allResponses,
    addResponse,
    reset,
    submitAll,
  };
}
