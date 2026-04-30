/**
 * Modelo de Tareas.
 * Contiene TODAS las consultas SQL relacionadas con tareas.
 * Es la única capa que habla directamente con la base de datos.
 */

const pool = require('../config/database');

// ============= MÉTODOS GENERALES REUTILIZABLES =============

/**
 * Ejecuta una consulta de forma genérica.
 * Maneja errores y simplifica la sintaxis.
 */
const executeQuery = async (query, params = []) => {
  try {
    const result = await pool.query(query, params);
    return { success: true, data: result.rows };
  } catch (error) {
    console.error('Error en consulta SQL:', error.message);
    return { success: false, error: error.message };
  }
};

// ============= CONSULTAS DE TAREAS =============

/**
 * Obtener todas las tareas de un usuario.
 * GET /tasks
 */
const getAllByUser = async (userId) => {
  const query = `
    SELECT * FROM tasks 
    WHERE user_id = $1 
    ORDER BY created_at DESC
  `;
  return await executeQuery(query, [userId]);
};

/**
 * Obtener una tarea por ID (verificando que pertenezca al usuario).
 * GET /tasks/:id
 */
const getById = async (id, userId) => {
  const query = `
    SELECT * FROM tasks 
    WHERE id = $1 AND user_id = $2
  `;
  const result = await executeQuery(query, [id, userId]);
  return result;
};

/**
 * Crear una nueva tarea.
 * POST /tasks
 */
const create = async (title, description, userId) => {
  const query = `
    INSERT INTO tasks (title, description, user_id) 
    VALUES ($1, $2, $3) 
    RETURNING *
  `;
  return await executeQuery(query, [title, description, userId]);
};

/**
 * Actualizar una tarea existente.
 * PUT /tasks/:id
 */
const update = async (id, userId, fields) => {
  const query = `
    UPDATE tasks 
    SET 
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      completed = COALESCE($3, completed),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $4 AND user_id = $5
    RETURNING *
  `;
  
  const values = [
    fields.title || null,
    fields.description || null,
    fields.completed !== undefined ? fields.completed : null,
    id,
    userId
  ];
  
  return await executeQuery(query, values);
};

/**
 * Eliminar una tarea.
 * DELETE /tasks/:id
 */
const deleteById = async (id, userId) => {
  const query = `
    DELETE FROM tasks 
    WHERE id = $1 AND user_id = $2 
    RETURNING id
  `;
  return await executeQuery(query, [id, userId]);
};

/**
 * Verificar si una tarea existe y pertenece al usuario.
 */
const exists = async (id, userId) => {

   console.log('=== MODEL exists ===');
  console.log('ID:', id, 'UserId:', userId);

  const query = `
    SELECT id FROM tasks 
    WHERE id = $1 AND user_id = $2
  `;

  console.log('Query:', query);
  console.log('Params:', [id, userId]);

  const result = await executeQuery(query, [id, userId]);

    console.log('Resultado de executeQuery:', result);
    
  return result.success && result.data.length > 0;
};

// ============= EXPORTACIÓN =============

module.exports = {
  getAllByUser,
  getById,
  create,
  update,
  deleteById,
  exists
};