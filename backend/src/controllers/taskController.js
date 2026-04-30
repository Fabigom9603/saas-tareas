/**
 * Controlador de tareas.
 * Maneja la lógica de negocio. NO contiene consultas SQL.
 * Todas las consultas SQL están en taskModel.js.
 */

const taskModel = require('../models/taskModel');
const { formatDatesInObject } = require('../utils/dateUtils');

// ============= OBTENER TODAS LAS TAREAS =============

const getTasks = async (req, res) => {
  const result = await taskModel.getAllByUser(req.user.id);
  
  if (!result.success) {
    return res.status(500).json({ message: 'Error al obtener tareas' });
  }
  
    // Formatear las fechas de todas las tareas
  const tasks = formatDatesInObject(result.data);

  res.json({
    success: true,
    count: tasks.length,
    tasks
  });
};

// ============= OBTENER UNA TAREA =============

const getTaskById = async (req, res) => {
  const { id } = req.params;
  const result = await taskModel.getById(id, req.user.id);
  
  if (!result.success) {
    return res.status(500).json({ message: 'Error al obtener tarea' });
  }
  
  if (result.data.length === 0) {
    return res.status(404).json({ message: 'Tarea no encontrada' });
  }

   // Formatear las fechas de la tarea
  const task = formatDatesInObject(result.data[0]);
  
  res.json({ success: true, task });
};

// ============= CREAR TAREA =============

const createTask = async (req, res) => {
  const { title, description } = req.body;
  
  if (!title) {
    return res.status(400).json({ message: 'El título es obligatorio' });
  }
  
  const result = await taskModel.create(title, description, req.user.id);
  
  if (!result.success) {
    return res.status(500).json({ message: 'Error al crear tarea' });
  }
  // Formatear las fechas de la tarea creada
  const task = formatDatesInObject(result.data[0]);
  
  res.status(201).json({
    success: true,
    message: 'Tarea creada exitosamente',
    task
  });
};

// ============= ACTUALIZAR TAREA =============

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  
  // Verificar que la tarea existe
  const existsResult = await taskModel.exists(id, req.user.id);

  if (!existsResult) {
    return res.status(404).json({ message: 'Tarea no encontrada' });
  }

  const result = await taskModel.update(id, req.user.id, { title, description, completed });

  if (!result.success) {
    return res.status(500).json({ message: 'Error al actualizar tarea' });
  }
  // Formatear las fechas de la tarea actualizada
  const task = formatDatesInObject(result.data[0]);
  
  res.json({
    success: true,
    message: 'Tarea actualizada exitosamente',
    task
  });
};

// ============= ELIMINAR TAREA =============

const deleteTask = async (req, res) => {
  const { id } = req.params;
  
  const exists = await taskModel.exists(id, req.user.id);
  if (!exists) {
    return res.status(404).json({ message: 'Tarea no encontrada' });
  }
  
  const result = await taskModel.deleteById(id, req.user.id);
  
  if (!result.success) {
    return res.status(500).json({ message: 'Error al eliminar tarea' });
  }
  
  res.json({
    success: true,
    message: 'Tarea eliminada exitosamente'
  });
};

// ============= EXPORTACIÓN =============

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};