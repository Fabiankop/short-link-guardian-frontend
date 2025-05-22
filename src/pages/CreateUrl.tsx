
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { addUrl, validateUrl } from '@/services/urlService';

const CreateUrl = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Token CSRF para protección
  const csrfToken = React.useMemo(() => Math.random().toString(36).slice(2), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!validateUrl(originalUrl)) {
        toast({
          title: "URL inválida",
          description: "Por favor, introduce una URL válida que comience con http:// o https://",
          variant: "destructive",
        });
        return;
      }

      const result = addUrl(originalUrl);
      
      if (result) {
        toast({
          title: "¡URL creada con éxito!",
          description: `Tu URL corta ha sido creada: ${window.location.origin}/r/${result.code}`,
        });
        setOriginalUrl('');
        navigate('/');
      } else {
        throw new Error('No se pudo crear la URL corta');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al crear la URL corta",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 animate-fade-in">
      <Card className="max-w-2xl mx-auto shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Crear nueva URL corta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo oculto para CSRF */}
            <input type="hidden" name="_csrf" value={csrfToken} />
            
            <div className="space-y-2">
              <label htmlFor="originalUrl" className="text-sm font-medium">
                URL Original
              </label>
              <Input
                id="originalUrl"
                placeholder="https://ejemplo.com/ruta/muy/larga"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                className="w-full"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !originalUrl.trim()}
            >
              {isLoading ? 'Creando...' : 'CREAR'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateUrl;
