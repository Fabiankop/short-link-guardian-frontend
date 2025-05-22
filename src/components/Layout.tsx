import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      (e.target as HTMLElement).click();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <img src="/assets/logo.svg" alt="Spot2" width={120} height={120} />
            </div>
            <div>
              <h4 className="text-lg mb-4">Enlaces rápidos</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/"
                    className="text-gray-400 hover:text-primary transition-colors"
                    tabIndex={0}
                    aria-label="Ir a la página de inicio"
                    onKeyDown={handleKeyDown}
                  >
                    Inicio
                  </a>
                </li>
                <li>
                  <a
                    href="/create"
                    className="text-gray-400 hover:text-primary transition-colors"
                    tabIndex={0}
                    aria-label="Ir a la página para acortar URL"
                    onKeyDown={handleKeyDown}
                  >
                    Acortar URL
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg mb-4">Contacto</h4>
              <p className="text-gray-400">dfabianrodriguez@gmail.com</p>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-gray-400">
            &copy; {new Date().getFullYear()} URLCorto - Todos los derechos reservados
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
