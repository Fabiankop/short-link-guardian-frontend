
import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">URLCorto</h3>
              <p className="text-gray-400">
                Tu servicio seguro para acortar enlaces y compartirlos fácilmente.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces rápidos</h4>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-400 hover:text-primary transition-colors">Inicio</a></li>
                <li><a href="/create" className="text-gray-400 hover:text-primary transition-colors">Acortar URL</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <p className="text-gray-400">info@urlcorto.com</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            &copy; {new Date().getFullYear()} URLCorto - Todos los derechos reservados
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
