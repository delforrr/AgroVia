// Middlewares de autenticación y autorización JWT — valida tokens de Supabase Auth
// authMiddleware  → adjunta req.userId en rutas protegidas
// adminMiddleware → verifica que el usuario tenga rol 'admin' (requiere authMiddleware previo)

import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

/**
 * authMiddleware
 * Verifica el Bearer JWT enviado en el header Authorization.
 * Extrae el `sub` (UUID del usuario de Supabase Auth) y lo adjunta a req.userId.
 */
export function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token de autenticación requerido.' });
    }

    const token  = authHeader.split(' ')[1];
    const secret = process.env.SUPABASE_JWT_SECRET;

    if (!secret) {
        console.error('[Auth] ERROR CRÍTICO: SUPABASE_JWT_SECRET no definido en las variables de entorno.');
        return res.status(500).json({ error: 'Error interno de configuración de seguridad.' });
    }

    try {
        const decoded = jwt.verify(token, secret);
        
        // El 'sub' en el JWT de Supabase es el UUID del usuario
        if (!decoded.sub) {
            return res.status(401).json({ error: 'Token inválido: falta identificador de usuario.' });
        }

        req.userId = decoded.sub;
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
