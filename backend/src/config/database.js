/**
 * CONFIGURACIÓN DE BASE DE DATOS
 * Este archivo maneja la conexión con PostgreSQL
 */

// Importar el cliente de PostgreSQL
const { Pool } = require('pg');

// Railway inyecta DATABASE_URL automáticamente
// Si existe DATABASE_URL, usarla (Railway)
// Si no, usar variables separadas (local)
const isProduction = !!process.env.DATABASE_URL;

let pool;

if (isProduction) {
  // Modo producción (Railway)
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  // Modo local (desarrollo)
  require('dotenv').config();
  pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
  });
}

console.log('🔍 Modo:', isProduction ? 'PRODUCCIÓN (Railway)' : 'DESARROLLO (Local)');

module.exports = pool;