import React, { useEffect, useState } from 'react';
import { findUrlByCode, findUrlByCodeDirect, trackUrlAccess, trackUrlAccessDirect } from '@/services/urlApiService';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, ExternalLink, AlertCircle, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/PageTransition';

enum LoadingState {
  INITIAL = 'initial',
  FINDING_URL = 'finding_url',
  TRACKING = 'tracking',
  REDIRECTING = 'redirecting',
  ERROR = 'error',
  SUCCESS = 'success',
}

const Redirect: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [targetUrl, setTargetUrl] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.INITIAL);
  const [progressPercentage, setProgressPercentage] = useState(0);

  // Simular progreso de carga
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (loadingState !== LoadingState.ERROR && loadingState !== LoadingState.SUCCESS) {
      // Incrementar gradualmente hasta 95% durante la carga
      interval = setInterval(() => {
        setProgressPercentage(prev => {
          if (prev < 95) {
            const increment = Math.random() * 10; // Incremento aleatorio para efecto más natural
            return Math.min(95, prev + increment);
          }
          return prev;
        });
      }, 150);
    } else if (loadingState === LoadingState.SUCCESS) {
      // Completa rápidamente al 100% cuando se redirige
      setProgressPercentage(100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loadingState]);

  useEffect(() => {
    const handleRedirect = async () => {
      if (!code) {
        setError('No se proporcionó un código de URL.');
        setLoadingState(LoadingState.ERROR);
        return;
      }

      try {
        setLoadingState(LoadingState.FINDING_URL);

        // Primero intentamos con la función directa
        let urlItem = await findUrlByCodeDirect(code);

        // Si no funciona, intentamos con el método original como fallback
        if (!urlItem) {
          urlItem = await findUrlByCode(code);
        }

        if (urlItem) {
          setTargetUrl(urlItem);
          setLoadingState(LoadingState.TRACKING);

          // Registrar el acceso a la URL
          try {
            const trackingSuccessful = await trackUrlAccessDirect(code);

            if (!trackingSuccessful) {
              // Si el método directo falla, intentamos con el método original
              await trackUrlAccess(code);
            }
          } catch (trackError) {
            // Error al registrar acceso, continuamos con la redirección
          }

          // Preparar para la redirección
          setLoadingState(LoadingState.REDIRECTING);

          // Pequeña pausa para mostrar la animación de redirección
          setTimeout(() => {
            setLoadingState(LoadingState.SUCCESS);
            // Redirección después de mostrar el mensaje de éxito
            setTimeout(() => {
              window.location.href = urlItem;
            }, 800);
          }, 500);
        } else {
          setError('La URL corta no existe o no se pudo recuperar.');
          setLoadingState(LoadingState.ERROR);
        }
      } catch (err) {
        setError('Ocurrió un error al procesar la URL corta.');
        setLoadingState(LoadingState.ERROR);
      }
    };

    handleRedirect();
  }, [code, navigate]);

  // Diferentes mensajes según el estado de carga
  const getLoadingMessage = (): string => {
    switch (loadingState) {
      case LoadingState.FINDING_URL:
        return 'Buscando la URL original...';
      case LoadingState.TRACKING:
        return 'Procesando el acceso...';
      case LoadingState.REDIRECTING:
        return 'Preparando redirección...';
      case LoadingState.SUCCESS:
        return '¡Redirigiendo!';
      default:
        return 'Procesando...';
    }
  };

  // Variantes para animaciones
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-xl overflow-hidden">
            <div className="relative">
              {/* Barra de progreso */}
              <div
                className="h-1 bg-gray-200 absolute top-0 left-0 right-0 z-10"
                aria-label="Progreso de redirección"
              >
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <CardContent className="p-6 pt-8">
                <AnimatePresence mode="wait">
                  {loadingState === LoadingState.ERROR ? (
                    <motion.div
                      key="error"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-6"
                    >
                      <div className="flex justify-center mb-4">
                        <div className="bg-red-100 p-3 rounded-full">
                          <AlertCircle className="h-12 w-12 text-red-500" />
                        </div>
                      </div>

                      <Alert variant="destructive" className="mb-4">
                        <AlertTitle className="font-semibold">Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>

                      <p className="text-gray-600 text-center">
                        No hemos podido redirigirte. Por favor, verifica el enlace o intenta de nuevo más tarde.
                      </p>

                      <div className="flex justify-center mt-4">
                        <Button
                          onClick={() => navigate('/')}
                          variant="default"
                          className="flex items-center"
                        >
                          <Home className="h-4 w-4 mr-2" />
                          Volver al inicio
                        </Button>
                      </div>
                    </motion.div>
                  ) : loadingState === LoadingState.SUCCESS ? (
                    <motion.div
                      key="success"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-4 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                      >
                        <ExternalLink className="h-12 w-12 text-primary mx-auto" />
                      </motion.div>

                      <h2 className="text-lg font-bold text-primary">¡Redirección exitosa!</h2>

                      <div className="flex flex-col items-center">
                        <p className="text-gray-600 mb-1">Redirigiendo a:</p>
                        <p className="text-sm text-gray-500 truncate max-w-full">
                          {targetUrl}
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="loading"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="min-h-[180px] flex flex-col items-center justify-center space-y-6 py-8"
                    >
                      <Loader2 className="h-10 w-10 text-primary animate-spin" />

                      <div className="text-center">
                        <h2 className="text-lg font-medium mb-1">{getLoadingMessage()}</h2>
                        <p className="text-sm text-gray-500">
                          Serás redirigido automáticamente
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </div>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Redirect;
