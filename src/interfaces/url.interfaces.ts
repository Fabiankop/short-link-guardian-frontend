/**
 * Tipos y interfaces relacionados con las URLs y sus operaciones
 */

/**
 * Respuesta de URL única (utilizada en redirección)
 */
export interface Url {
  url: string;
}

/**
 * Información de una URL acortada
 */
export interface UrlItem {
  id: number;
  code: string;
  original_url: string;
  created_at: string; // ISO date string
  clickCount?: number;
  lastAccessed?: string;
}

/**
 * DTO para la creación de una nueva URL
 */
export interface CreateUrlDTO extends Record<string, unknown> {
  original_url: string;
}

/**
 * Estadísticas de acceso a una URL
 */
export interface UrlStats {
  clickCount: number;
  lastAccessed?: string;
}

/**
 * Datos para registrar acceso a una URL
 */
export interface UrlAccessData extends Record<string, unknown> {
  timestamp: string;
  userAgent: string;
  referer: string | null;
}
