
import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">{children}</main>
      <footer className="bg-white py-4 text-center text-gray-500 text-sm border-t">
        <div className="container mx-auto">
          &copy; {new Date().getFullYear()} URLCorto - Acortador de enlaces seguro
        </div>
      </footer>
    </div>
  );
};

export default Layout;
