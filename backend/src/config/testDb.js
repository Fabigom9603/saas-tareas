/**
 * PRUEBA DE CONEXIÓN A BASE DE DATOS
 * Este archivo verifica que PostgreSQL está respondiendo correctamente
 */

const pool = require('./database');

const testConnection = async () => {
  try {
    // Intentar hacer una consulta simple a la base de datos
    const result = await pool.query('SELECT NOW() as current_time');
    console.log('✅ Conexión a PostgreSQL exitosa');
    console.log('📅 Hora del servidor:', result.rows[0].current_time);
  } catch (error) {
    console.error('❌ Error al conectar a PostgreSQL:', error.message);
  } finally {
    // Cerrar el pool para que el programa termine
    pool.end();
  }
};

testConnection();