/**
 * CONFIGURACIÓN DE BASE DE DATOS
 * Este archivo maneja la conexión con PostgreSQL
 */

// Importar el cliente de PostgreSQL
const { Pool } = require('pg');

// Detectar si estamos en Railway (tiene DATABASE_URL)
const isRailway = !!process.env.DATABASE_URL;

let pool;

if (isRailway) {
  // Modo Railway
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  console.log('🔍 Conectando a BD en RAILWAY');
} else {
  // Modo Local - limpiar variables globales y cargar .env
  delete process.env.DB_USER;
  delete process.env.DB_PASSWORD;
  delete process.env.DB_HOST;
  delete process.env.DB_PORT;
  delete process.env.DB_NAME;
  
  require('dotenv').config();
  
  pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
  });
  console.log('🔍 Conectando a BD en LOCAL');
}

module.exports = pool;