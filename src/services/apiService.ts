import { API_BASE_URL, API_TIMEOUT } from '@/config';
import { ApiError, FetchOptions, TimeoutError, OpenApiSpec } from '@/interfaces/api.interfaces';

/**
 * Función principal para realizar peticiones a la API
 * @param endpoint Ruta relativa del endpoint (sin la URL base)
 * @param options Opciones de fetch + timeout y params adicionales
 * @returns Promise con la respuesta procesada
 */
export const fetchApi = async <T> (
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> => {
  const {
    timeout = API_TIMEOUT,
    params,
    headers = {},
    body,
    ...restOptions
  } = options;

  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value);
    });
    url += `?${searchParams.toString()}`;
  }

  const token = localStorage.getItem('auth_token');
  const defaultHeaders: HeadersInit = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  let processedBody: BodyInit | undefined = body as BodyInit | undefined;
  const contentTypeHeader = defaultHeaders['Content-Type'] || defaultHeaders['content-type'];
  const effectiveContentType = (contentTypeHeader || 'application/json') as string;

  // Solo procesar el body si es un objeto literal (plain object)
  if (body && typeof body === 'object' &&
      Object.prototype.toString.call(body) === '[object Object]') {

    if (effectiveContentType.includes('application/x-www-form-urlencoded')) {
      processedBody = new URLSearchParams(Object.entries(body)).toString();
    } else if (effectiveContentType.includes('application/json')) {
      processedBody = JSON.stringify(body);
    }
  } else if (body instanceof URLSearchParams && effectiveContentType.includes('application/x-www-form-urlencoded')) {
    processedBody = body.toString();
  }

  if (!contentTypeHeader && !(processedBody instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers: defaultHeaders,
      body: processedBody,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      let errorData: Record<string, unknown>;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText };
      }

      throw new ApiError(
        String(errorData.message) || `Error ${response.status}`,
        response.status,
        errorData
      );
    }

    // Si la respuesta es 204 No Content o no tiene contenido
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {} as T;
    }

    // Procesar la respuesta como JSON
    return (await response.json()) as T;
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      throw new TimeoutError();
    }

    if (error instanceof ApiError) {
      throw error;
    }

    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    throw new ApiError(errorMessage, 500);
  }
};

/**
 * Métodos HTTP para la API
 */
export const api = {
  get: <T>(endpoint: string, options?: FetchOptions): Promise<T> =>
    fetchApi<T>(endpoint, { method: 'GET', ...options }),

  post: <T>(endpoint: string, data?: Record<string, unknown> | URLSearchParams | string, options?: FetchOptions): Promise<T> => {
    const headers = { ...options?.headers };
    let body: BodyInit | undefined = undefined;

    if (data) {
      if (options?.headers && (options.headers['Content-Type'] === 'application/x-www-form-urlencoded' || options.headers['content-type'] === 'application/x-www-form-urlencoded')) {
        body = data instanceof URLSearchParams ? data.toString() : new URLSearchParams(data as Record<string, string>).toString();
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
      } else if (typeof data === 'string') {
        body = data;
        if (!headers['Content-Type'] && !headers['content-type']) {
          headers['Content-Type'] = 'application/json';
        }
      } else {
        body = JSON.stringify(data);
        if (!headers['Content-Type'] && !headers['content-type']) {
          headers['Content-Type'] = 'application/json';
        }
      }
    }

    return fetchApi<T>(endpoint, {
      method: 'POST',
      headers,
      body,
      ...options,
    });
  },

  put: <T>(endpoint: string, data?: Record<string, unknown>, options?: FetchOptions): Promise<T> =>
    fetchApi<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      ...options
    }),

  patch: <T>(endpoint: string, data?: Record<string, unknown>, options?: FetchOptions): Promise<T> =>
    fetchApi<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      ...options
    }),

  delete: <T>(endpoint: string, options?: FetchOptions): Promise<T> =>
    fetchApi<T>(endpoint, { method: 'DELETE', ...options }),
};
