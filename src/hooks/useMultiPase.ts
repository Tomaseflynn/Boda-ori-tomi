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
    setAllResponses(prev => [...prev, response]);

    if (currentPase < totalPases) {
      setCurrentPase(prev => prev + 1);
      return false; // aún quedan pases por completar
    } else {
      return true; // se alcanzó el último pase
    }
  };

  const reset = () => {
    setCurrentPase(1);
    setAllResponses([]);
  };

  const submitAll = async () => {
    if (allResponses.length === 0) return null;

    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(allResponses),
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
