// Middlewares de autenticación y autorización JWT — valida tokens de Supabase Auth
// authMiddleware  → adjunta req.userId en rutas protegidas
// Middleware de autenticación JWT — valida tokens emitidos por Supabase Auth
import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token de autenticación requerido.' });
    }

    const token  = authHeader.split(' ')[1];
    const secret = process.env.SUPABASE_JWT_SECRET;

    if (!secret) {
        console.error('[Auth] ERROR CRÍTICO: SUPABASE_JWT_SECRET no definido.');
        return res.status(500).json({ error: 'Error interno de configuración.' });
    }

    try {
        const decoded = jwt.verify(token, secret);

        if (!decoded.sub) {
            return res.status(401).json({ error: 'Token inválido: falta sub.' });
        }

        req.userId = decoded.sub;

        // Extraer rol de los metadatos del usuario si existe en el token
        // Supabase guarda el rol en app_metadata usualmente
        req.userRol = decoded.app_metadata?.role || 'usuario';

        next();
    } catch (err) {
        const message = err.name === 'TokenExpiredError' ? 'El token ha expirado.' : 'Token inválido.';
        return res.status(401).json({ error: message });
    }
}


/**
 * adminMiddleware
 * Debe usarse SIEMPRE después de authMiddleware.
 * Consulta public.usuarios para verificar que el usuario autenticado tenga rol = 'admin'.
 * También bloquea cuentas suspendidas.
 */
export async function adminMiddleware(req, res, next) {
    if (!req.userId) {
        return res.status(401).json({ error: 'Autenticación requerida.' });
    }

    try {
        const { rows } = await pool.query(
            `SELECT rol, suspendido FROM public.usuarios WHERE id = $1`,
            [req.userId]
        );

        if (rows.length === 0) {
            return res.status(403).json({ error: 'Usuario no encontrado.' });
        }

        const { rol, suspendido } = rows[0];

        if (suspendido) {
            return res.status(403).json({ error: 'Cuenta suspendida. Contactá al administrador.' });
        }

        if (rol !== 'admin') {
            return res.status(403).json({ error: 'Acceso denegado: se requiere rol de administrador.' });
        }

        req.userRol = rol;
        next();
    } catch (err) {
        console.error('[adminMiddleware] Error al verificar rol:', err.message);
        return res.status(500).json({ error: 'Error interno al verificar permisos.' });
    }
}
