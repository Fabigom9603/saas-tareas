/**
 * Componente principal de la aplicación.
 * Maneja la navegación entre Login y Registro,
 * y protege las rutas según autenticación.
 */

import React from 'react';
import { useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Layout } from './components/Layout';
import './App.css';

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Estado local para mostrar Login o Registro
  const [showLogin, setShowLogin] = React.useState(true);

  // Funciones para cambiar entre pantallas
  const handleSwitchToRegister = () => setShowLogin(false);
  const handleSwitchToLogin = () => setShowLogin(true);

  // Mientras verifica autenticación, mostrar carga
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  // Si NO está autenticado, mostrar Login o Registro
  if (!isAuthenticated) {
    return (
      <div className="auth-wrapper">
        {showLogin ? (
          <Login onSwitchToRegister={handleSwitchToRegister} />
        ) : (
          <Register onSwitchToLogin={handleSwitchToLogin} />
        )}
      </div>
    );
  }

  // Si está autenticado, mostrar Layout (próximamente con las tareas)
  return (
    <Layout>
      <div className="tasks-container">
        <h2>Bienvenido al Sistema de Tareas</h2>
        <p>Próximamente: Lista de tareas, crear, editar y eliminar.</p>
      </div>
    </Layout>
  );
}

export default App;