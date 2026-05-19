/**
 * Formulario para crear o editar tareas.
 * 
 * Se muestra como un modal superpuesto sobre el contenido principal.
 * Funciona tanto para creación (taskToEdit = null) como para edición.
 */

import React, { useState, useEffect } from 'react';
import { createTask, updateTask, Task } from '../../services/api';

interface TaskFormProps {
  /** Tarea a editar (null si es creación) */
  taskToEdit: Task | null;
  /** Función a ejecutar después de guardar exitosamente */
  onSuccess: () => void;
  /** Función para cerrar el formulario sin guardar */
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ taskToEdit, onSuccess, onCancel }) => {
  // ============= ESTADO =============
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // ============= EFECTOS =============
  // Carga los datos de la tarea a editar cuando el componente se abre
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
    } else {
      // Resetear formulario para nueva tarea
      setTitle('');
      setDescription('');
    }
  }, [taskToEdit]);

  // ============= MANEJADORES =============
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!title.trim()) {
      setError('El título es obligatorio');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (taskToEdit) {
        // Modo edición: actualizar tarea existente
        await updateTask(taskToEdit.id, { title, description });
      } else {
        // Modo creación: nueva tarea
        await createTask(title, description);
      }
      onSuccess(); // Notificar al padre que la operación fue exitosa
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar tarea');
    } finally {
      setIsLoading(false);
    }
  };

  // ============= RENDERIZADO =============
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header del modal */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            {taskToEdit ? 'Editar Tarea' : 'Nueva Tarea'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-red-500 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-4">
          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Campo de título */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Comprar leche"
              disabled={isLoading}
              autoFocus
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Campo de descripción */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción (opcional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles adicionales de la tarea..."
              rows={4}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
            />
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:bg-gray-400"
            >
              {isLoading ? 'Guardando...' : taskToEdit ? 'Actualizar' : 'Crear Tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;