/**
 * Layout principal de la aplicación.
 */

import React, { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-gray-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-xl font-bold">📋 Gestor de Tareas</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-gray-300">
                  👋 Hola, <strong className="text-white">{user.name}</strong>
                </span>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Cerrar Sesión
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center py-4 text-sm">
        <p>Sistema de Gestión de Tareas | React + Node.js + PostgreSQL</p>
      </footer>
    </div>
  );
};

export default Layout;