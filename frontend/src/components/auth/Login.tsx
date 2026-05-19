/**
 * Componente de inicio de sesión.
 * 
 * Permite a usuarios existentes autenticarse en la aplicación.
 * Almacena el token JWT y los datos del usuario en el contexto global.
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface LoginProps {
  /** Función para cambiar a la pantalla de registro */
  onSwitchToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSwitchToRegister }) => {
  // ============= ESTADO DEL FORMULARIO =============
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');        // Mensaje de error
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  
  // Obtiene la función login desde el contexto de autenticación
  const { login } = useAuth();

  // ============= MANEJADOR DE ENVÍO =============
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();           // Evita recarga de página
    setError('');                 // Limpia errores previos
    setIsLoading(true);           // Deshabilita formulario durante la petición

    try {
      await login(email, password);
      // Si el login es exitoso, App.tsx redirige automáticamente al dashboard
    } catch (err: any) {
      // Muestra el error del backend o un mensaje genérico
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);        // Reactiva el formulario
    }
  };

  // ============= RENDERIZADO =============
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Iniciar Sesión
        </h2>
        
        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo de email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ejemplo@correo.com"
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Campo de contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Cargando...' : 'Ingresar'}
          </button>
        </form>

        {/* Enlace a registro */}
        <p className="text-center text-gray-600 mt-4">
          ¿No tienes cuenta?{' '}
          <button
            onClick={onSwitchToRegister}
            disabled={isLoading}
            className="text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400"
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;