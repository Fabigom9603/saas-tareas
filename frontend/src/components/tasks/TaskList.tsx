/**
 * Lista de tareas del usuario.
 * 
 * Funcionalidades:
 * - Muestra todas las tareas del usuario autenticado
 * - Filtrado por estado (Todas / Pendientes / Completadas)
 * - Búsqueda en tiempo real por título o descripción
 * - Marcar tareas como completadas
 * - Editar y eliminar tareas
 */

import React, { useState, useEffect } from 'react';
import { getTasks, deleteTask, updateTask, Task } from '../../services/api';

interface TaskListProps {
  /** Función para editar una tarea (abre el formulario) */
  onEdit: (task: Task) => void;
  /** Trigger para recargar la lista (cambia cuando se crea/edita/elimina una tarea) */
  refreshTrigger: number;
}

type FilterType = 'all' | 'pending' | 'completed';

export const TaskList: React.FC<TaskListProps> = ({ onEdit, refreshTrigger }) => {
  // ============= ESTADO =============
  const [tasks, setTasks] = useState<Task[]>([]);           // Todas las tareas
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]); // Tareas filtradas
  const [filter, setFilter] = useState<FilterType>('all');   // Filtro activo
  const [searchTerm, setSearchTerm] = useState('');          // Término de búsqueda
  const [isLoading, setIsLoading] = useState(true);          // Estado de carga
  const [error, setError] = useState('');                    // Mensaje de error

  // ============= EFECTOS =============
  
  // Carga las tareas cuando el componente se monta o cuando refreshTrigger cambia
  useEffect(() => {
    loadTasks();
  }, [refreshTrigger]);

  // Aplica filtros y búsqueda cada vez que cambian las tareas, el filtro o la búsqueda
  useEffect(() => {
    applyFilters();
  }, [tasks, filter, searchTerm]);

  // ============= FUNCIONES PRINCIPALES =============
  
  /** Carga las tareas desde el backend */
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

  /** Aplica filtro por estado y búsqueda por texto */
  const applyFilters = () => {
    let result = [...tasks];

    // Filtro por estado
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

    // Filtro por búsqueda (título o descripción)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(task => 
        task.title.toLowerCase().includes(term) ||
        (task.description && task.description.toLowerCase().includes(term))
      );
    }

    setFilteredTasks(result);
  };

  /** Marca/desmarca una tarea como completada */
  const handleToggleComplete = async (task: Task) => {
    try {
      await updateTask(task.id, { completed: !task.completed });
      await loadTasks(); // Recarga la lista para mostrar el cambio
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar tarea');
    }
  };

  /** Elimina una tarea (con confirmación) */
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar esta tarea?')) return;
    
    try {
      await deleteTask(id);
      await loadTasks(); // Recarga la lista después de eliminar
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar tarea');
    }
  };

  /** Limpia el campo de búsqueda */
  const clearSearch = () => setSearchTerm('');

  // ============= CONTADORES =============
  const totalCount = tasks.length;
  const pendingCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  // ============= RENDERIZADO =============
  
  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Cargando tareas...</div>;
  }

  if (error) {
    return <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header con búsqueda y filtros */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Mis Tareas ({filteredTasks.length})
        </h3>
        
        {/* Barra de búsqueda */}
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
        
        {/* Botones de filtro */}
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

      {/* Indicador de resultados de búsqueda */}
      {searchTerm && filteredTasks.length > 0 && (
        <div className="bg-blue-50 text-blue-700 p-2 rounded-lg mb-4 text-sm">
          🔍 Resultados para: <strong>"{searchTerm}"</strong>
        </div>
      )}

      {/* Lista vacía */}
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
        /* Lista de tareas */
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`border rounded-lg p-4 transition hover:shadow-md ${
                task.completed ? 'bg-gray-50 opacity-75' : 'bg-white'
              }`}
            >
              <div className="flex justify-between items-start">
                {/* Info de la tarea */}
                <div className="flex-1">
                  <h4 className={`font-semibold text-lg ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="text-gray-600 mt-1">{task.description}</p>
                  )}
                </div>
                {/* Botones de acción */}
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
              {/* Footer con checkbox y fecha */}
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