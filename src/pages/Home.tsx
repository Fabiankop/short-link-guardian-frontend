
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { getUrls, deleteUrl, UrlItem } from '@/services/urlService';
import { Trash2, Plus } from 'lucide-react';

const Home = () => {
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const { toast } = useToast();

  // Cargar URLs al cargar la página
  useEffect(() => {
    loadUrls();
  }, []);

  const loadUrls = () => {
    const loadedUrls = getUrls();
    setUrls(loadedUrls);
  };

  const handleCopy = async (code: string) => {
    try {
      const shortUrl = `${window.location.origin}/r/${code}`;
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

  const handleDelete = (id: number) => {
    try {
      const deleted = deleteUrl(id);
      if (deleted) {
        setUrls(urls.filter(url => url.id !== id));
        toast({
          title: "URL eliminada",
          description: "La URL se ha eliminado correctamente",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la URL",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">URLs Acortadas</h1>
        <Button asChild>
          <Link to="/create">
            <Plus className="mr-2 h-4 w-4" />
            Nueva URL
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
                <TableHead className="w-[150px] text-right">Acciones</TableHead>
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
                    >
                      {url.code}
                    </TableCell>
                    <TableCell className="truncate max-w-[300px]" title={url.originalUrl}>
                      <a 
                        href={url.originalUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-primary hover:underline"
                      >
                        {url.originalUrl}
                      </a>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(url.id)}
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
    </div>
  );
};

export default Home;
