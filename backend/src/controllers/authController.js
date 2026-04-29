/**
 * Controlador de autenticación.
 * Maneja la lógica de registro y login de usuarios.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// ============= REGISTRO DE USUARIO =============

/**
 * Registra un nuevo usuario en el sistema.
 * 
 * Espera recibir: name, email, password
 * Encripta la contraseña antes de guardarla.
 * Devuelve un token JWT para autenticación.
 */
const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Validar que todos los campos estén presentes
  if (!name || !email || !password) {
    return res.status(400).json({ 
      message: 'Faltan campos requeridos: name, email, password' 
    });
  }

  try {
    // Verificar si el email ya está registrado
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Guardar el usuario en la base de datos
    const result = await pool.query(
      `INSERT INTO users (name, email, password) 
       VALUES ($1, $2, $3) 
       RETURNING id, name, email, created_at`,
      [name, email, hashedPassword]
    );

    const user = result.rows[0];

    // Generar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Devolver usuario (sin contraseña) y token
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at
      },
      token
    });

  } catch (error) {
    console.error('Error en registro:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// ============= LOGIN DE USUARIO =============

/**
 * Inicia sesión de un usuario existente.
 * 
 * Espera recibir: email, password
 * Verifica credenciales y devuelve un token JWT.
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  // Validar que ambos campos estén presentes
  if (!email || !password) {
    return res.status(400).json({ 
      message: 'Faltan campos requeridos: email, password' 
    });
  }

  try {
    // Buscar usuario por email
    const result = await pool.query(
      'SELECT id, name, email, password FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = result.rows[0];

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar nuevo token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Devolver usuario (sin contraseña) y token
    res.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    });

  } catch (error) {
    console.error('Error en login:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// ============= EXPORTACIÓN =============

module.exports = { register, login };