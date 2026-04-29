/**
 * Rutas de autenticación.
 * Define los endpoints para registro y login.
 */

const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// ============= ENDPOINTS =============

// POST /api/auth/register - Crear nueva cuenta
router.post('/register', register);

// POST /api/auth/login - Iniciar sesión
router.post('/login', login);

// ============= EXPORTACIÓN =============

module.exports = router;