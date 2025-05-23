import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, AlertTriangle } from "lucide-react";
import PageTransition from "@/components/PageTransition";

const NotFound: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Efecto para registrar intentos de acceso a rutas no existentes
  useEffect(() => {
    // Ruta no encontrada: {location.pathname}
  }, [location.pathname]);

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-center">
            <CardTitle className="text-2xl">Página no encontrada</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center space-y-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 15
                }}
              >
                <div className="bg-red-100 p-3 rounded-full mb-2">
                  <AlertTriangle className="h-16 w-16 text-red-500" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-center"
              >
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-6">
                  La página que estás buscando no existe o ha sido movida.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleGoHome}
                  className="flex items-center"
                  size="lg"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Volver al inicio
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
};

export default NotFound;
