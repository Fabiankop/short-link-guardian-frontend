import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '@/services/apiService';
import { ApiError } from '@/interfaces/api.interfaces';
import { User, AuthResponse } from '@/interfaces/auth.interfaces';
import { TOKEN_EXPIRATION } from '@/config';

// Las interfaces User y AuthResponse se moverán a auth.types.ts

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginError: string | null; // Para mostrar errores de login en la UI
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Valores por defecto para el contexto
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  loginError: null,
  login: async () => false,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string | null>(null); // Estado para errores de login

  // Verificar si el usuario está autenticado al cargar
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');

      if (token && storedUser) {
        try {
          const tokenExpiry = localStorage.getItem('token_expiry');
          if (tokenExpiry && new Date().getTime() > parseInt(tokenExpiry)) {
            handleLogout();
            return;
          }
          // Si se decide verificar el token con /users/me al inicio:
          // try {
          //   const currentUser = await api.get<User>('/users/me');
          //   setUser(currentUser);
          // } catch (verifyError) {
          //   handleLogout();
          // }
          const parsedUser = JSON.parse(storedUser) as User;
          setUser(parsedUser);
        } catch (error) {
          handleLogout();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);


  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setLoginError(null);

    const body = new URLSearchParams();
    body.append('grant_type', 'password');
    body.append('username', username);
    body.append('password', password);

    try {
      const loginResponse = await api.post<AuthResponse>('/users/login', body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        }
      });

      if (loginResponse && loginResponse.access_token && loginResponse.token_type) {
        localStorage.setItem('auth_token', loginResponse.access_token);

        try {
          const userInfo = await api.get<User>('/users/me');

          if (!userInfo || !userInfo.id) { // Verificar si userInfo es válido y tiene al menos un id
             localStorage.removeItem('auth_token'); // Limpiar el token si los datos del usuario fallan
             throw new Error('No se pudo obtener la información del usuario.');
          }

          localStorage.setItem('auth_user', JSON.stringify(userInfo));
          const expiryTime = new Date().getTime() + TOKEN_EXPIRATION;
          localStorage.setItem('token_expiry', expiryTime.toString());

          setUser(userInfo);
          setIsLoading(false);
          return true;

        } catch (userError) {
          localStorage.removeItem('auth_token'); // Limpiar el token si /users/me falla
          // Re-lanzar para que sea capturado por el catch principal y se muestre el error
          throw userError;
        }
      } else {
        throw new Error('Respuesta de login inválida desde la API (token no recibido).');
      }

    } catch (error) {
      // Asegurarse de limpiar el token si algo falló en el proceso general
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user'); // También el usuario si se llegó a guardar
      localStorage.removeItem('token_expiry');

      let errorMessage = 'Ocurrió un error durante el login. Intenta de nuevo.';
      if (error instanceof ApiError) {
        if (error.status === 400 || error.status === 401 || error.status === 403) {
          errorMessage = (error.data?.message as string) || 'Usuario o contraseña incorrectos, o cliente no autorizado.';
        } else {
          errorMessage = error.message || errorMessage;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setLoginError(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  const handleLogout = (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('token_expiry');
    setUser(null);
    setLoginError(null); // Limpiar errores de login al desloguear
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    loginError, // Exponer el error de login
    login,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para acceder al contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
