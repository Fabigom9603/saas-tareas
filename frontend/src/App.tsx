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
import './App.css';

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Estado local para mostrar Login o Registro
  const [showLogin, setShowLogin] = React.useState(true);


    // Estados para el manejo de tareas
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [refreshTasks, setRefreshTasks] = useState(0);
  
  // Funciones para cambiar entre pantallas
  const handleSwitchToRegister = () => setShowLogin(false);
  const handleSwitchToLogin = () => setShowLogin(true);

  // Funciones para el manejo de tareas
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
    setRefreshTasks(prev => prev + 1); // Recargar la lista de tareas
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setTaskToEdit(null);
  };



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
        <div className="tasks-header">
          <h2>Mis Tareas</h2>
          <button className="create-task-btn" onClick={handleOpenCreateForm}>
            + Nueva Tarea
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