import { api } from './apiService';
import DOMPurify from 'dompurify';
import { BASE_URL } from '@/config';
import { Url, UrlItem, CreateUrlDTO, UrlStats, UrlAccessData } from '@/interfaces/url.interfaces';
import { ApiResponse } from '@/interfaces/api.interfaces';

/**
 * Validar que la URL tiene un formato correcto
 * @param url URL a validar
 * @returns Booleano indicando si la URL es válida
 */
export const validateUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch (err) {
    return false;
  }
};

/**
 * Sanitizar URL para prevenir XSS
 * @param url URL a sanitizar
 * @returns URL sanitizada
 */
export const sanitizeUrl = (url: string): string => {
  return DOMPurify.sanitize(url);
};

/**
 * Obtener todas las URLs
 * @returns Promise con array de UrlItems
 */
export const getUrls = async (): Promise<UrlItem[]> => {
  try {
    const response = await api.get<UrlItem[] | ApiResponse<UrlItem[]>>('/urls/');

    if (Array.isArray(response)) {
      return response;
    } else if ('data' in response && Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  } catch (error) {
    return [];
  }
};

/**
 * Agregar una nueva URL corta
 * @param originalUrl URL original a acortar
 * @returns Promise con el objeto UrlItem creado o null si hay error
 */
export const addUrl = async (originalUrl: string): Promise<UrlItem | null> => {
  try {
    // Validar y sanitizar la URL
    if (!validateUrl(originalUrl)) {
      throw new Error('URL inválida');
    }

    const sanitizedUrl = sanitizeUrl(originalUrl);
    const dto: CreateUrlDTO = { original_url: sanitizedUrl };

    // Realizar petición a la API
    const response = await api.post<UrlItem | ApiResponse<UrlItem>>('/urls/', dto);

    // Comprobar si la respuesta tiene estructura { data: UrlItem }
    if ('data' in response && response.data) {
      return response.data;
    }

    // Si la respuesta es directamente el objeto UrlItem
    return response as UrlItem;
  } catch (error) {
    return null;
  }
};

/**
 * Encontrar URL por código
 * @param code Código de la URL acortada
 * @returns Promise con la URL original o null si no existe
 */
export const findUrlByCode = async (code: string): Promise<string | null> => {
  try {
    // Usar la API con la ruta correcta
    const response = await api.get<Url | ApiResponse<Url>>(`/r/api/url/${code}`);

    // Comprobar la estructura de la respuesta
    if ('url' in response && typeof response.url === 'string') {
      return response.url;
    }

    if ('data' in response && response.data) {
      if ('url' in response.data && typeof response.data.url === 'string') {
        return response.data.url;
      }
    }

    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Esta función realiza una solicitud directa a la ruta específica del acortador de URLs
 * sin usar la API_BASE_URL estándar, ya que la ruta de redirección tiene una estructura diferente.
 * @param code Código de la URL acortada
 * @returns Promise con la URL original o null
 */
export const findUrlByCodeDirect = async (code: string): Promise<string | null> => {
  try {
    // Usar directamente la ruta especificada
    const url = `${BASE_URL}/r/api/url/${code}`;

    // Añadir el encabezado para evitar advertencias de ngrok
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    // Verificar estructura de respuesta
    if ('url' in data && typeof data.url === 'string') {
      return data.url;
    }

    if ('data' in data && data.data && typeof data.data === 'object') {
      const nestedData = data.data;
      if ('url' in nestedData && typeof nestedData.url === 'string') {
        return nestedData.url;
      }
    }

    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Obtener estadísticas de una URL
 * @param code Código de la URL
 * @returns Promise con estadísticas o null si hay error
 */
export const getUrlStats = async (code: string): Promise<UrlStats | null> => {
  try {
    const response = await api.get<UrlStats | ApiResponse<UrlStats>>(`/urls/${code}/stats`);

    // Comprobar estructura de respuesta
    if ('clickCount' in response) {
      return response as UrlStats;
    }

    if ('data' in response && response.data) {
      if ('clickCount' in response.data) {
        return response.data as UrlStats;
      }
    }

    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Eliminar URL
 * @param id ID de la URL a eliminar
 * @returns Promise booleano indicando éxito
 */
export const deleteUrl = async (id: number): Promise<boolean> => {
  try {
    await api.delete(`/urls/${id}`);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Registrar acceso a URL acortada
 * @param code Código de la URL acortada
 * @returns Promise booleano indicando éxito
 */
export const trackUrlAccess = async (code: string): Promise<boolean> => {
  try {
    const accessData: UrlAccessData = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referer: document.referrer || null
    };

    await api.post(`/urls/${code}/access`, accessData);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Registrar acceso a URL acortada usando la ruta específica
 * @param code Código de la URL acortada
 * @returns Promise booleano indicando éxito
 */
export const trackUrlAccessDirect = async (code: string): Promise<boolean> => {
  try {
    // Usar directamente la ruta especificada
    const url = `${BASE_URL}/r/api/url/${code}/access`;

    const accessData: UrlAccessData = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referer: document.referrer || null
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify(accessData)
    });

    if (!response.ok) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};
