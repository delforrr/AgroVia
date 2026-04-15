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
