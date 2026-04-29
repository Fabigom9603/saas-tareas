/**
 * INICIALIZACIÓN DE BASE DE DATOS
 * Este archivo crea las tablas necesarias para el proyecto
 */

const pool = require('../config/database');

/**
 * Crear tabla de USUARIOS
 * Almacena la información de cada persona que se registra
 */
const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
  console.log('✅ Tabla "users" creada/verificada');
};

/**
 * Crear tabla de TAREAS
 * Cada tarea pertenece a un usuario (relación por user_id)
 */
const createTasksTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      completed BOOLEAN DEFAULT FALSE,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
  console.log('✅ Tabla "tasks" creada/verificada');
};

/**
 * Función principal que ejecuta ambas creaciones
 */
const initDatabase = async () => {
  try {
    await createUsersTable();
    await createTasksTable();
    console.log('🎉 Base de datos inicializada correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error.message);
};
};
// ============= EXPORTACIÓN =============
module.exports = { initDatabase };