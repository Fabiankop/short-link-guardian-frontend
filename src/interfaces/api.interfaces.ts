/**
 * Tipos y interfaces relacionados con la API y peticiones HTTP
 */

/**
 * Opciones para las peticiones fetchApi
 */
export interface FetchOptions extends RequestInit {
  timeout?: number;
  params?: Record<string, string>;
}

/**
 * Error estándar de la API
 */
export class ApiError extends Error {
  status: number;
  data: Record<string, unknown>;

  constructor(message: string, status: number, data?: Record<string, unknown>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data || {};
  }
}

/**
 * Error de timeout en peticiones
 */
export class TimeoutError extends ApiError {
  constructor(message = 'La solicitud ha excedido el tiempo máximo de espera') {
    super(message, 408);
    this.name = 'TimeoutError';
  }
}

/**
 * Interfaz para la especificación OpenAPI
 */
export interface OpenApiSpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  paths: Record<string, unknown>;
  components?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Respuesta estándar de la API
 * Algunas APIs devuelven los datos en una propiedad data
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
  [key: string]: unknown;
}
