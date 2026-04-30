/**
 * Configuración principal del servidor Express.
 * Maneja middlewares, inicialización de base de datos y rutas.
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./src/config/database');
const { initDatabase } = require('./src/models/initDb');

// ============= CONFIGURACIÓN DE ENTORNO =============
// Elimina variables de entorno existentes para evitar conflictos con configuraciones globales del sistema
delete process.env.DB_USER;
delete process.env.DB_PASSWORD;
delete process.env.DB_HOST;
delete process.env.DB_PORT;
delete process.env.DB_NAME;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============= MIDDLEWARE =============
// Funciones que se ejecutan antes de llegar a las rutas

// cors: permite que el frontend (React en puerto 3000) se comunique con este backend
app.use(cors());

// express.json: convierte las peticiones JSON entrantes en objetos JavaScript disponibles en req.body
app.use(express.json());

// ============= RUTAS =============

// Rutas de autenticación (registro y login)
app.use('/api/auth', require('./src/routes/authRoutes'));

// Rutas de tareas (protegidas por autenticación)
app.use('/api/tasks', require('./src/routes/taskRoutes'));

// Endpoint de verificación para comprobar que el servidor está funcionando
app.get('/api/health', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// ============= INICIO DEL SERVIDOR =============

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  await initDatabase();
});