/**
 * Lista de tareas del usuario.
 * Muestra todas las tareas con opciones para editar, eliminar y marcar como completada.
 * Incluye filtros por estado y búsqueda por texto.
 */

import React, { useState, useEffect } from 'react';
import { getTasks, deleteTask, updateTask, Task } from '../../services/api';
import './TaskList.css';

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

  // Cargar tareas al montar el componente y cuando refreshTrigger cambie
  useEffect(() => {
    loadTasks();
  }, [refreshTrigger]);

  // Aplicar filtro y búsqueda cuando cambien las tareas, el filtro o el término de búsqueda
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

    // Aplicar filtro por estado
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

    // Aplicar búsqueda por título o descripción
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

  // Contadores para cada estado
  const totalCount = tasks.length;
  const pendingCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  // Limpiar búsqueda
  const clearSearch = () => {
    setSearchTerm('');
  };

  if (isLoading) {
    return <div className="task-list-loading">Cargando tareas...</div>;
  }

  if (error) {
    return <div className="task-list-error">{error}</div>;
  }

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h3 className="task-list-title">Mis Tareas ({filteredTasks.length})</h3>
        
        {/* Barra de búsqueda */}
        <div className="task-search">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Buscar por título o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={clearSearch}>
              ✕
            </button>
          )}
        </div>
        
        {/* Filtros */}
        <div className="task-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todas ({totalCount})
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pendientes ({pendingCount})
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completadas ({completedCount})
          </button>
        </div>
      </div>

      {/* Mostrar resultados de búsqueda */}
      {searchTerm && filteredTasks.length > 0 && (
        <div className="search-results-info">
          🔍 Resultados para: <strong>"{searchTerm}"</strong>
        </div>
      )}

      {filteredTasks.length === 0 ? (
        <div className="task-list-empty">
          {searchTerm ? (
            <>
              <p>🔍 No se encontraron tareas que coincidan con "{searchTerm}"</p>
              <button className="clear-search-btn-link" onClick={clearSearch}>
                Limpiar búsqueda
              </button>
            </>
          ) : (
            <>
              {filter === 'pending' && (
                <>
                  <p>🎉 ¡No tienes tareas pendientes!</p>
                  <p>Todas tus tareas están completadas.</p>
                </>
              )}
              {filter === 'completed' && (
                <>
                  <p>📝 Aún no has completado tareas.</p>
                  <p>¡Sigue trabajando en ellas!</p>
                </>
              )}
              {filter === 'all' && (
                <>
                  <p>No tienes tareas aún.</p>
                  <p>Crea tu primera tarea usando el botón "+ Nueva Tarea".</p>
                </>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="task-items">
          {filteredTasks.map((task) => (
            <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <div className="task-content">
                <div className="task-header">
                  <h4 className="task-title">{task.title}</h4>
                  <div className="task-actions">
                    <button
                      onClick={() => onEdit(task)}
                      className="task-btn edit-btn"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="task-btn delete-btn"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
                
                <div className="task-footer">
                  <label className="task-complete-label">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task)}
                    />
                    {task.completed ? 'Completada' : 'Pendiente'}
                  </label>
                  <span className="task-date">
                    Creada: {task.created_at}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;