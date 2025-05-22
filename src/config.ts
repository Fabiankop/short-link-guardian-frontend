// Configuración global de la aplicación

// URL base de la API - Se obtiene del archivo .env
export const BASE_URL = import.meta.env.VITE_API_URL;
const version = 'v1';
const route = 'api';

// URL completa de la API incluyendo versión y ruta
export const API_BASE_URL = `${BASE_URL}/${route}/${version}`;

// Tiempo de expiración del token en milisegundos (por defecto 24 horas)
export const TOKEN_EXPIRATION = parseInt(import.meta.env.VITE_TOKEN_EXPIRATION || String(24 * 60 * 60 * 1000));

// Nombre de la aplicación
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Spot2';

// Configuración de rutas públicas (no requieren autenticación)
export const PUBLIC_ROUTES = ['/login', '/r', '/r/:code'];

// Configuración de timeout para peticiones API (en milisegundos)
export const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10);
