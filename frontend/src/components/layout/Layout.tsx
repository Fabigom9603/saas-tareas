/**
 * Layout principal de la aplicación.
 * Componente que envuelve todas las páginas.
 */

import React, { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="layout">
      {/* ============= HEADER ============= */}
      <header className="layout-header">
        <div>
          <h1 className="layout-title">📋 Gestor de Tareas</h1>
        </div>
        
        <div className="layout-user-info">
          {user && (
            <>
              <span>
                👋 Hola, <strong>{user.name}</strong>
              </span>
              <button className="layout-logout-btn" onClick={logout}>
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      </header>

      {/* ============= CONTENIDO PRINCIPAL ============= */}
      <main className="layout-main">
        {children}
      </main>

      {/* ============= FOOTER ============= */}
      <footer className="layout-footer">
        <p>
          Sistema de Gestión de Tareas | React + Node.js + PostgreSQL
        </p>
      </footer>
    </div>
  );
};

export default Layout;