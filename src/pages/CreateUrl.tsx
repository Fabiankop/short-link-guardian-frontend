import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { addUrl, validateUrl } from '@/services/urlApiService';
import { UrlItem } from '@/interfaces/url.interfaces';
import { Loader2, CheckCircle2, Copy, Home, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/PageTransition';

const CreateUrl: React.FC = () => {
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [createdUrl, setCreatedUrl] = useState<UrlItem | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Token CSRF para protección
  const csrfToken = React.useMemo(() => Math.random().toString(36).slice(2), []);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setOriginalUrl(e.target.value);
    // Limpiar mensaje de confirmación al cambiar la URL
    if (createdUrl) {
      setCreatedUrl(null);
    }
    // Reiniciar estado de error si hay un valor
    if (error && e.target.value) {
      setError(null);
    }
  };

  const handleCopyShortUrl = async (): Promise<void> => {
    if (!createdUrl || !createdUrl.code) return;

    try {
      // Construir la URL corta completa
      const shortUrlToCopy = `${window.location.origin}/r/${createdUrl.code}`;
      await navigator.clipboard.writeText(shortUrlToCopy);

      // Mostrar animación de copiado
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);

      toast({
        title: "¡Copiado!",
        description: "La URL corta se ha copiado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo copiar la URL",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setCreatedUrl(null);

    if (!validateUrl(originalUrl)) {
      setError('Por favor, introduce una URL válida (ej: https://example.com)');
      return;
    }

    setIsLoading(true);
    try {
      const newUrl = await addUrl(originalUrl);

      if (newUrl && newUrl.code) {
        setError(null);
        setCreatedUrl(newUrl);
        setOriginalUrl(''); // Limpiar input
        toast({
          title: 'URL Corta Creada',
          description: `Tu URL corta es: ${window.location.origin}/r/${newUrl.code}`,
          className: 'bg-green-100 border-green-400 text-green-700',
        });
      } else {
        setError('No se pudo crear la URL corta. Intenta de nuevo.');
        toast({
          title: 'Error al Crear URL',
          description: 'No se pudo crear la URL corta. Por favor, inténtalo de nuevo.',
          variant: 'destructive',
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error desconocido.';
      setError(errorMessage);
      toast({
        title: 'Error Inesperado',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToHome = (): void => {
    navigate('/');
  };

  const handleCreateAnother = (): void => {
    setCreatedUrl(null);
    setOriginalUrl('');
    setError(null);
  };

  // Variantes para animaciones
  const formVariants = {
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
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  const resultVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
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
      <div className="container mx-auto py-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-2xl mx-auto shadow-lg overflow-hidden">
            <CardHeader className="bg-primary from-primary to-primary-hover">
              <CardTitle className="text-2xl text-center text-white">
                Crear nueva URL corta
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <AnimatePresence mode="wait">
                {createdUrl ? (
                  <motion.div
                    key="result"
                    variants={resultVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.1
                      }}
                    >
                      <div className="flex justify-center mb-4">
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                      </div>

                      <Alert className="bg-green-50 border-green-200 mb-6">
                        <AlertDescription className="text-center font-medium text-green-700">
                          ¡URL acortada con éxito!
                        </AlertDescription>
                      </Alert>
                    </motion.div>

                    <motion.div
                      className="flex items-center space-x-2 p-4 border rounded-md bg-gray-50"
                      whileHover={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-primary font-medium truncate flex-1">
                        {`${window.location.origin}/r/${createdUrl.code}`}
                      </p>
                      <Button
                        onClick={handleCopyShortUrl}
                        aria-label="Copiar URL corta"
                        variant={isCopied ? "default" : "outline"}
                        size="sm"
                        className="transition-all duration-300"
                      >
                        {isCopied ? (
                          <span className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Copiado
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Copy className="h-4 w-4 mr-1" />
                            Copiar
                          </span>
                        )}
                      </Button>
                    </motion.div>

                    <motion.div
                      className="flex justify-end space-x-3 mt-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <Button
                        variant="outline"
                        onClick={handleCreateAnother}
                        aria-label="Crear otra URL corta"
                        className="flex items-center"
                      >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Crear otra
                      </Button>
                      <Button
                        onClick={handleGoToHome}
                        aria-label="Ir a la página principal"
                        className="flex items-center"
                      >
                        <Home className="h-4 w-4 mr-1" />
                        Ir al inicio
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <input type="hidden" name="_csrf" value={csrfToken} />

                    <div className="space-y-2">
                      <label htmlFor="originalUrl" className="text-sm font-medium">
                        URL Original
                      </label>
                      <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                        <Input
                          id="originalUrl"
                          placeholder="https://ejemplo.com/ruta/muy/larga"
                          value={originalUrl}
                          onChange={handleUrlChange}
                          className="w-full transition-all duration-300"
                          required
                          aria-label="Ingresa la URL que deseas acortar"
                          aria-required="true"
                          disabled={isLoading}
                        />
                      </motion.div>
                    </div>

                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Alert variant="destructive">
                            <div className="flex items-start">
                              <AlertCircle className="h-4 w-4 mr-2 mt-1" />
                              <div>
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                              </div>
                            </div>
                          </Alert>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        type="submit"
                        className="w-full transition-all duration-300"
                        disabled={isLoading || !originalUrl.trim()}
                        aria-label="Crear URL corta"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generando enlace...
                          </>
                        ) : (
                          'CREAR'
                        )}
                      </Button>
                    </motion.div>
                  </motion.form>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default CreateUrl;
