/**
 * Componente principal de la aplicación.
 * Maneja la navegación entre Login y Registro,
 * y protege las rutas según autenticación.
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
  const { isAuthenticated, isLoading } = useAuth();
  
  const [showLogin, setShowLogin] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [refreshTasks, setRefreshTasks] = useState(0);

  const handleSwitchToRegister = () => setShowLogin(false);
  const handleSwitchToLogin = () => setShowLogin(true);

  const handleOpenCreateForm = () => {
    setTaskToEdit(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setShowTaskForm(true);
  };

  const handleTaskFormSuccess = () => {
    setShowTaskForm(false);
    setTaskToEdit(null);
    setRefreshTasks(prev => prev + 1);
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setTaskToEdit(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Cargando...</p>
      </div>
    );
  }

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

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Mis Tareas</h2>
          <button
            onClick={handleOpenCreateForm}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
          >
            <span>+</span> Nueva Tarea
          </button>
        </div>
        
        <TaskList 
          onEdit={handleEditTask} 
          refreshTrigger={refreshTasks} 
        />
        
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