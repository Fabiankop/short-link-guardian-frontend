/**
 * Tipos y interfaces relacionados con la autenticación y usuarios
 */

/**
 * Datos del usuario autenticado
 */
export interface User {
  id: number;
  username: string;
  role: string;
  // Otros campos que pueda tener el usuario
  // email?: string;
  // name?: string;
}

/**
 * Respuesta de la API al iniciar sesión
 */
export interface AuthResponse {
  access_token: string;
  token_type: string;
  // Si la API devuelve información de expiración
  // expires_in?: number;
}
