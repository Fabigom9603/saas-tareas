/**
 * CONFIGURACIÓN DE BASE DE DATOS
 * Este archivo maneja la conexión con PostgreSQL
 */

// Importar el cliente de PostgreSQL
const { Pool } = require('pg');

// IMPORTANTE: Limpiar variables de entorno existentes de PostgreSQL
delete process.env.DB_USER;
delete process.env.DB_PASSWORD;
delete process.env.DB_HOST;
delete process.env.DB_PORT;
delete process.env.DB_NAME;

// Cargar variables de entorno (necesario para leer credenciales)
require('dotenv').config();

// LÍNEA TEMPORAL PARA DEPURAR: Muestra qué usuario está usando
console.log('🔍 Leyendo desde .env:');
console.log('Usuario de BD:', process.env.DB_USER);
console.log('Base de datos:', process.env.DB_NAME);

/**
 * Pool de conexiones a PostgreSQL
 * Un "pool" mantiene múltiples conexiones listas para usar
 * Esto es más eficiente que abrir/cerrar conexiones todo el tiempo
 */
const pool = new Pool({
  user: process.env.DB_USER,      // Usuario de PostgreSQL (por defecto: postgres)
  password: process.env.DB_PASSWORD, // Contraseña de PostgreSQL
  host: process.env.DB_HOST,      // Servidor (localhost)
  port: process.env.DB_PORT,      // Puerto (5432 es el default de PostgreSQL)
  database: process.env.DB_NAME,  // Nombre de la base de datos (tareas_db)
});

// Exportar el pool para que otros archivos puedan usarlo
module.exports = pool;