// Middleware de autenticación JWT — valida tokens emitidos por Supabase Auth
// Adjunta req.userId (UUID del usuario) en rutas protegidas (POST, PUT, DELETE)

import jwt from 'jsonwebtoken';

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

    // En desarrollo sin JWT configurado, permite pasar con advertencia
    if (!secret) {
        console.warn('[Auth] ⚠️  SUPABASE_JWT_SECRET no definido — omitiendo validación JWT');
        return next();
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.userId = decoded.sub; // UUID del usuario autenticado en Supabase
        next();
    } catch {
        return res.status(401).json({ error: 'Token inválido o expirado.' });
    }
}
