/**
 * Rutas de tareas.
 * Todas las rutas están protegidas por autenticación.
 */

const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

const router = express.Router();

// ============= APLICAR MIDDLEWARE DE AUTENTICACIÓN A TODAS LAS RUTAS =============
// Esto protege todas las rutas de tareas. Sin token válido, no se puede acceder.
router.use(protect);

// ============= ENDPOINTS =============

// GET /api/tasks - Obtener todas las tareas del usuario
router.get('/', getTasks);

// GET /api/tasks/:id - Obtener una tarea específica
router.get('/:id', getTaskById);

// POST /api/tasks - Crear una nueva tarea
router.post('/', createTask);

// PUT /api/tasks/:id - Actualizar una tarea
router.put('/:id', updateTask);

// DELETE /api/tasks/:id - Eliminar una tarea
router.delete('/:id', deleteTask);

// ============= EXPORTACIÓN =============

module.exports = router;