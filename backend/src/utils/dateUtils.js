/**
 * Utilidades para manejo de fechas.
 * Centraliza el formateo de fechas en toda la aplicación.
 */

// ============= CONFIGURACIÓN =============

// Zona horaria de Colombia (UTC-5)
const TIMEZONE = 'America/Bogota';

// Locale para formato en español
const LOCALE = 'es-CO';

// ============= FORMATO COMPLETO =============

/**
 * Formatea una fecha a string local completo.
 * Ejemplo: "30/4/2026, 11:02:20"
 */
const formatDateTime = (date) => {
  if (!date) return null;
  return new Date(date).toLocaleString(LOCALE, { timeZone: TIMEZONE });
};

// ============= FORMATO DE FECHA SOLO (SIN HORA) =============

/**
 * Formatea solo la fecha (sin hora).
 */
const formatDateOnly = (date) => {
  if (!date) return null;
  return new Date(date).toLocaleDateString(LOCALE, { timeZone: TIMEZONE });
};

// ============= FORMATO DE HORA SOLO (SIN FECHA) =============

/**
 * Formatea solo la hora (sin fecha).
 */
const formatTimeOnly = (date) => {
  if (!date) return null;
  return new Date(date).toLocaleTimeString(LOCALE, { timeZone: TIMEZONE });
};

// ============= FORMATO PERSONALIZADO =============

/**
 * Formatea una fecha con opciones personalizadas.
 * 
 * Ejemplo de opciones:
 * { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
 * Resultado: "miércoles, 30 de abril de 2026"
 */
const formatCustom = (date, options = {}) => {
  if (!date) return null;
  return new Date(date).toLocaleString(LOCALE, { timeZone: TIMEZONE, ...options });
};

// ============= FORMATEAR OBJETO O ARRAY =============

/**
 * Recibe un objeto o array y formatea todos los campos que parecen fechas.
 * Útil para respuestas de API.
 */
const formatDatesInObject = (data, dateFields = ['created_at', 'updated_at']) => {
  if (!data) return data;
  
  // Si es array, procesar cada elemento
  if (Array.isArray(data)) {
    return data.map(item => formatDatesInObject(item, dateFields));
  }
  
  // Si es objeto, procesar sus propiedades
  if (typeof data === 'object') {
    const formatted = { ...data };
    dateFields.forEach(field => {
      if (formatted[field]) {
        formatted[field] = formatDateTime(formatted[field]);
      }
    });
    return formatted;
  }
  
  return data;
};

// ============= EXPORTACIÓN =============

module.exports = {
  formatDateTime,
  formatDateOnly,
  formatTimeOnly,
  formatCustom,
  formatDatesInObject,
  TIMEZONE,
  LOCALE
};