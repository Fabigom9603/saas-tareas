/**
 * Componente de estructura principal de la aplicación.
 * 
 * Define el layout común para todas las páginas internas:
 * - Header con información del usuario y botón de cierre
 * - Main con el contenido dinámico
 * - Footer con información del proyecto
 */

import React, { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
  /** Contenido de la página (componentes hijos) */
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* ============= HEADER ============= */}
      <header className="bg-gray-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center flex-wrap gap-4">
          {/* Logo / Título */}
          <div>
            <h1 className="text-xl font-bold">📋 Gestor de Tareas</h1>
          </div>
          
          {/* Info del usuario y logout */}
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

      {/* ============= CONTENIDO PRINCIPAL ============= */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {children}
      </main>

      {/* ============= FOOTER ============= */}
      <footer className="bg-gray-800 text-gray-400 text-center py-4 text-sm">
        <p>Sistema de Gestión de Tareas | React + Node.js + PostgreSQL</p>
      </footer>
    </div>
  );
};

export default Layout;