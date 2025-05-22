
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { findUrlByCode } from '@/services/urlService';

const Redirect = () => {
  const { code } = useParams<{ code: string }>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) {
      setError('Código de URL inválido');
      return;
    }

    // Buscar la URL correspondiente al código
    const url = findUrlByCode(code);

    if (url) {
      // Redireccionar a la URL original
      window.location.href = url.originalUrl;
    } else {
      setError('URL no encontrada');
    }
  }, [code]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center animate-fade-in">
      <div className="text-center p-8 max-w-md">
        {error ? (
          <>
            <h1 className="text-2xl font-bold text-red-500">{error}</h1>
            <p className="mt-2 text-gray-600">El enlace que intentas acceder no existe o ha sido eliminado.</p>
            <a href="/" className="mt-6 block text-primary hover:underline">Volver al inicio</a>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">Redireccionando...</h1>
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Redirect;
