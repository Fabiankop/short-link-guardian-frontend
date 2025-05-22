
import { nanoid } from 'nanoid';
import DOMPurify from 'dompurify';

// Interfaz para los objetos de URL
export interface UrlItem {
  id: number;
  code: string;
  originalUrl: string;
  createdAt: Date;
}

// Simulamos almacenamiento en localStorage
const STORAGE_KEY = 'shortened_urls';

// Función para generar un código único y seguro
export const generateSecureCode = (): string => {
  // Usamos nanoid para generar IDs aleatorios y seguros (no secuenciales)
  return nanoid(8);
};

// Función para sanitizar URLs y prevenir XSS
export const sanitizeUrl = (url: string): string => {
  // Sanitizamos la URL para prevenir XSS
  return DOMPurify.sanitize(url);
};

// Validar que la URL tiene un formato correcto
export const validateUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch (err) {
    return false;
  }
};

// Obtener todas las URLs
export const getUrls = (): UrlItem[] => {
  try {
    const urls = localStorage.getItem(STORAGE_KEY);
    return urls ? JSON.parse(urls) : [];
  } catch (error) {
    console.error('Error al obtener URLs:', error);
    return [];
  }
};

// Agregar una nueva URL corta
export const addUrl = (originalUrl: string): UrlItem | null => {
  try {
    // Validar y sanitizar la URL
    if (!validateUrl(originalUrl)) {
      throw new Error('URL inválida');
    }
    
    const sanitizedUrl = sanitizeUrl(originalUrl);
    const urls = getUrls();
    
    // Verificar si la URL ya existe
    const existingUrl = urls.find(url => url.originalUrl === sanitizedUrl);
    if (existingUrl) {
      return existingUrl;
    }
    
    // Crear nueva URL corta
    const newUrl: UrlItem = {
      id: Date.now(),
      code: generateSecureCode(),
      originalUrl: sanitizedUrl,
      createdAt: new Date()
    };
    
    // Guardar en localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify([newUrl, ...urls]));
    
    return newUrl;
  } catch (error) {
    console.error('Error al crear URL corta:', error);
    return null;
  }
};

// Encontrar URL por código
export const findUrlByCode = (code: string): UrlItem | null => {
  try {
    const urls = getUrls();
    const url = urls.find(url => url.code === code);
    return url || null;
  } catch (error) {
    console.error('Error al buscar URL:', error);
    return null;
  }
};

// Eliminar URL
export const deleteUrl = (id: number): boolean => {
  try {
    const urls = getUrls();
    const updatedUrls = urls.filter(url => url.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUrls));
    return true;
  } catch (error) {
    console.error('Error al eliminar URL:', error);
    return false;
  }
};
