/**
 * CORS Middleware - SOLO PARA DESARROLLO
 * 
 * Este middleware permite testing desde cualquier origin cuando el frontend
 * está en localhost y el backend en Vercel.
 * 
 * REMOVER EN PRODUCCIÓN cuando frontend y backend estén en el mismo dominio.
 * 
 * Para desactivar: Eliminar las llamadas a handleCors() en los endpoints de auth.
 */

export function handleCors(req, res) {
  // Solo aplicar CORS si la variable de entorno está activa
  const enableDevCors = process.env.ENABLE_DEV_CORS === 'true'

  if (!enableDevCors) {
    return // No hacer nada en producción
  }

  // Leer el origin del request
  const origin = req.headers.origin

  if (origin) {
    // Devolver el origin específico del request (funciona como "*" pero compatible con credentials)
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }
}
