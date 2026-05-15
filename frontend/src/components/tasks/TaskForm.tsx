/**
 * Formulario para crear o editar tareas.
 */

import React, { useState, useEffect } from 'react';
import { createTask, updateTask, Task } from '../../services/api';
import './TaskForm.css';

interface TaskFormProps {
  taskToEdit: Task | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ taskToEdit, onSuccess, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Si hay una tarea para editar, cargar sus datos
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [taskToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('El título es obligatorio');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (taskToEdit) {
        // Actualizar tarea existente
        await updateTask(taskToEdit.id, { title, description });
      } else {
        // Crear nueva tarea
        await createTask(title, description);
      }
      onSuccess(); // Notificar al padre que la operación fue exitosa
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar tarea');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="task-form-overlay">
      <div className="task-form-container">
        <div className="task-form-header">
          <h3>{taskToEdit ? 'Editar Tarea' : 'Nueva Tarea'}</h3>
          <button className="close-btn" onClick={onCancel}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          {error && (
            <div className="form-error">{error}</div>
          )}

          <div className="form-group">
            <label htmlFor="title">Título *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Comprar leche"
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción (opcional)</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles adicionales de la tarea..."
              rows={4}
              disabled={isLoading}
            />
          </div>

          <div className="task-form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : taskToEdit ? 'Actualizar' : 'Crear Tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;