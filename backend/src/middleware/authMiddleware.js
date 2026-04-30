/**
 * Middleware de autenticación.
 * Verifica el token JWT en las peticiones protegidas.
 */

const jwt = require('jsonwebtoken');

// ============= MIDDLEWARE PRINCIPAL =============

/**
 * Extrae y valida el token del header Authorization.
 * Si es válido, adjunta el usuario a req.user y continúa.
 * Si no es válido, retorna error 401.
 */
const protect = async (req, res, next) => {
  let token;

  // El token debe venir en el header: Authorization: Bearer <token>
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ 
      message: 'Acceso denegado. No se proporcionó token.' 
    });
  }

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Adjuntar el usuario a la petición para usarlo en los controladores
    req.user = {
      id: decoded.userId,
      email: decoded.email
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ 
      message: 'Token inválido o expirado.' 
    });
  }
};

// ============= EXPORTACIÓN =============

module.exports = { protect };