import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener la URL de origen (a donde el usuario intentaba acceder)
  const from = location.state?.from?.pathname || '/';

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUsername(e.target.value);
    if (error) setError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    // Validación básica
    if (!username.trim() || !password.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const success = await login(username, password);

      if (success) {
        // Redirigir a la página de origen o al inicio
        navigate(from, { replace: true });
      } else {
        setError('Credenciales inválidas. Recuerda que la contraseña debe tener al menos 6 caracteres.');
      }
    } catch (err) {
      setError('Ocurrió un error al intentar iniciar sesión');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 flex flex-col items-center pb-2">
          <div className="flex justify-center mb-6">
            <img src="/assets/logo.svg" alt="Spot2" width={120} height={60} className="h-16 object-contain" />
          </div>
          <CardTitle className="text-2xl text-center">Iniciar sesión</CardTitle>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Usuario
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Tu nombre de usuario"
                value={username}
                onChange={handleUsernameChange}
                disabled={isSubmitting}
                className="w-full"
                autoComplete="username"
                aria-label="Nombre de usuario"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Contraseña
                </label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Tu contraseña"
                value={password}
                onChange={handlePasswordChange}
                disabled={isSubmitting}
                className="w-full"
                autoComplete="current-password"
                aria-label="Contraseña"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-6"
              disabled={isSubmitting}
              aria-label="Iniciar sesión"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-gray-500">
            <Link to="/r" className="text-primary hover:underline">
              Acceder a enlace público
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
