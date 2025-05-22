import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { getUrls, deleteUrl } from '@/services/urlApiService';
import { UrlItem } from '@/interfaces/url.interfaces';
import { Trash2, Plus, ExternalLink } from 'lucide-react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

const Home: React.FC = () => {
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [, setApiStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const { toast } = useToast();
  const shortUrlBase = window.location.origin + '/r/';
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState<number | null>(null);

  useEffect(() => {
    const initialLoad = async () => {
      setApiStatus('loading');
      try {
        const [urlsData] = await Promise.all([
          getUrls()
        ]);
        setUrls(urlsData);
      } catch (error) {
        console.error('Error en la carga inicial:', error);
        setUrls([]);
        setApiStatus('error');
        toast({
          title: "Error al cargar datos",
          description: "No se pudieron cargar las URLs o el estado de la API.",
          variant: "destructive",
        });
      }
    };
    initialLoad();
  }, [toast]);


  const handleCopy = async (code: string): Promise<void> => {
    try {
      const shortUrl = `${shortUrlBase}${code}`;
      await navigator.clipboard.writeText(shortUrl);
      toast({
        title: "Copiado al portapapeles",
        description: "La URL se ha copiado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo copiar la URL",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (urlId: number) => {
    setUrlToDelete(urlId);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (urlToDelete !== null) {
      const success = await deleteUrl(urlToDelete);
      if (success) {
        setUrls(prevUrls => prevUrls.filter(url => url.id !== urlToDelete));
        toast({
          title: "URL eliminada",
          description: "La URL ha sido eliminada correctamente",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: "No se pudo eliminar la URL",
          variant: "destructive",
        });
      }
      setShowDeleteDialog(false);
      setUrlToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setUrlToDelete(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, callback: () => void): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };

  const handleOpenShortUrl = (code: string): void => {
    window.open(`${shortUrlBase}${code}`, '_blank');
    toast({
      title: "Abriendo enlace",
      description: `Redirigiendo a la URL acortada: ${code}`,
    });
  };

  return (
    <div className="container mx-auto py-10 px-4 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl">Shortened URLs</h1>
        <Button className="rounded-full" asChild>
          <Link
            to="/create"
            aria-label="Crear nueva URL"
          >
            <Plus className="mr-2 h-4 w-4" />
            Crear URL
          </Link>
        </Button>
      </div>

      <Card className="shadow-md">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead className="w-[120px]">Código</TableHead>
                <TableHead>URL Original</TableHead>
                <TableHead className="w-[180px] text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {urls.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                    No hay URLs acortadas. ¡Crea una nueva!
                  </TableCell>
                </TableRow>
              ) : (
                urls.map((url, index) => (
                  <TableRow key={url.id}>
                    <TableCell className="font-medium">#{index + 1}</TableCell>
                    <TableCell
                      className="font-mono cursor-pointer text-primary hover:underline"
                      onClick={() => handleCopy(url.code)}
                      onKeyDown={(e) => handleKeyDown(e, () => handleCopy(url.code))}
                      tabIndex={0}
                      role="button"
                      aria-label={`Copiar URL corta: ${url.code}`}
                    >
                      {url.code}
                    </TableCell>
                    <TableCell className="truncate max-w-[300px]" title={url.original_url}>
                      <a
                        href={url.original_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary hover:underline"
                        aria-label={`Visitar URL original: ${url.original_url}`}
                      >
                        {url.original_url}
                      </a>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenShortUrl(url.code)}
                        onKeyDown={(e) => handleKeyDown(e, () => handleOpenShortUrl(url.code))}
                        aria-label={`Abrir URL acortada: ${url.code}`}
                        className="mr-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(url.id)}
                        aria-label={`Eliminar URL: ${url.code}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        title="Eliminar URL"
        message="¿Estás seguro de que deseas eliminar esta URL? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        variant="danger"
      />
    </div>
  );
};

export default Home;
