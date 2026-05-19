/**
 * Lista de tareas del usuario.
 */

import React, { useState, useEffect } from 'react';
import { getTasks, deleteTask, updateTask, Task } from '../../services/api';

interface TaskListProps {
  onEdit: (task: Task) => void;
  refreshTrigger: number;
}

type FilterType = 'all' | 'pending' | 'completed';

export const TaskList: React.FC<TaskListProps> = ({ onEdit, refreshTrigger }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTasks();
  }, [refreshTrigger]);

  useEffect(() => {
    applyFilters();
  }, [tasks, filter, searchTerm]);

  const loadTasks = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getTasks();
      setTasks(response.tasks);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar tareas');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...tasks];

    switch (filter) {
      case 'pending':
        result = result.filter(task => !task.completed);
        break;
      case 'completed':
        result = result.filter(task => task.completed);
        break;
      default:
        break;
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(task => 
        task.title.toLowerCase().includes(term) ||
        (task.description && task.description.toLowerCase().includes(term))
      );
    }

    setFilteredTasks(result);
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      await updateTask(task.id, { completed: !task.completed });
      await loadTasks();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar tarea');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar esta tarea?')) return;
    
    try {
      await deleteTask(id);
      await loadTasks();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar tarea');
    }
  };

  const totalCount = tasks.length;
  const pendingCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;
  const clearSearch = () => setSearchTerm('');

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Cargando tareas...</div>;
  }

  if (error) {
    return <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Mis Tareas ({filteredTasks.length})
        </h3>
        
        {/* Búsqueda */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="🔍 Buscar por título o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
            >
              ✕
            </button>
          )}
        </div>
        
        {/* Filtros */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm transition ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Todas ({totalCount})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded-full text-sm transition ${
              filter === 'pending' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pendientes ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded-full text-sm transition ${
              filter === 'completed' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Completadas ({completedCount})
          </button>
        </div>
      </div>

      {searchTerm && filteredTasks.length > 0 && (
        <div className="bg-blue-50 text-blue-700 p-2 rounded-lg mb-4 text-sm">
          🔍 Resultados para: <strong>"{searchTerm}"</strong>
        </div>
      )}

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {searchTerm ? (
            <>
              <p>🔍 No se encontraron tareas que coincidan con "{searchTerm}"</p>
              <button onClick={clearSearch} className="text-blue-600 hover:underline mt-2">
                Limpiar búsqueda
              </button>
            </>
          ) : (
            <>
              {filter === 'pending' && (
                <p>🎉 ¡No tienes tareas pendientes! Todas tus tareas están completadas.</p>
              )}
              {filter === 'completed' && (
                <p>📝 Aún no has completado tareas. ¡Sigue trabajando en ellas!</p>
              )}
              {filter === 'all' && (
                <p>No tienes tareas aún. Crea tu primera tarea usando el botón "+ Nueva Tarea".</p>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`border rounded-lg p-4 transition hover:shadow-md ${
                task.completed ? 'bg-gray-50 opacity-75' : 'bg-white'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className={`font-semibold text-lg ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="text-gray-600 mt-1">{task.description}</p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => onEdit(task)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task)}
                    className="w-4 h-4"
                  />
                  {task.completed ? 'Completada' : 'Pendiente'}
                </label>
                <span className="text-xs text-gray-400">
                  Creada: {task.created_at}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;