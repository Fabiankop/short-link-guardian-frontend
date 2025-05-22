
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm w-full py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary flex items-center">
          <span>URL</span>
          <span className="text-gray-800">Corto</span>
        </Link>
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="text-gray-600 hover:text-primary">
              Inicio
            </Link>
          </li>
          <li>
            <Link to="/create" className="text-gray-600 hover:text-primary">
              Crear URL
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
