/**
 * Componente raíz de la aplicación.
 * 
 * Controla el flujo de autenticación y la navegación principal.
 * - Usuario no autenticado → muestra Login/Register
 * - Usuario autenticado → muestra el gestor de tareas
 */

import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { Layout } from './components/layout/Layout';
import { TaskList } from './components/tasks/TaskList';
import { TaskForm } from './components/tasks/TaskForm';
import { Task } from './services/api';

function App() {
  // ============= ESTADO GLOBAL (desde Context) =============
  const { isAuthenticated, isLoading } = useAuth();
  
  // ============= ESTADO LOCAL =============
  const [showLogin, setShowLogin] = useState(true);        // Alterna entre Login y Register
  const [showTaskForm, setShowTaskForm] = useState(false); // Controla visibilidad del formulario
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null); // Tarea en edición (null = nueva)
  const [refreshTasks, setRefreshTasks] = useState(0);     // Trigger para recargar la lista

  // ============= MANEJADORES DE NAVEGACIÓN =============
  const handleSwitchToRegister = () => setShowLogin(false);
  const handleSwitchToLogin = () => setShowLogin(true);

  // ============= MANEJADORES DE TAREAS =============
  const handleOpenCreateForm = () => {
    setTaskToEdit(null);      // Modo creación
    setShowTaskForm(true);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);      // Modo edición
    setShowTaskForm(true);
  };

  const handleTaskFormSuccess = () => {
    setShowTaskForm(false);
    setTaskToEdit(null);
    setRefreshTasks(prev => prev + 1); // Recarga TaskList
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setTaskToEdit(null);
  };

  // ============= PANTALLA DE CARGA =============
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Cargando...</p>
      </div>
    );
  }

  // ============= PANTALLA DE AUTENTICACIÓN =============
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100">
        {showLogin ? (
          <Login onSwitchToRegister={handleSwitchToRegister} />
        ) : (
          <Register onSwitchToLogin={handleSwitchToLogin} />
        )}
      </div>
    );
  }

  // ============= PANTALLA PRINCIPAL (USUARIO AUTENTICADO) =============
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header con título y botón de crear */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Mis Tareas</h2>
          <button
            onClick={handleOpenCreateForm}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
          >
            <span>+</span> Nueva Tarea
          </button>
        </div>
        
        {/* Lista de tareas */}
        <TaskList 
          onEdit={handleEditTask} 
          refreshTrigger={refreshTasks} 
        />
        
        {/* Modal para crear/editar tareas */}
        {showTaskForm && (
          <TaskForm
            taskToEdit={taskToEdit}
            onSuccess={handleTaskFormSuccess}
            onCancel={handleCloseTaskForm}
          />
        )}
      </div>
    </Layout>
  );
}

export default App;