import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import jwt from 'jsonwebtoken';

dotenv.config();

const swaggerDocument = JSON.parse(fs.readFileSync(new URL('./docs/swagger.json', import.meta.url)));

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Middleware de autenticación JWT (Supabase Auth)
// Aplica a rutas que modifican datos (POST, PUT, DELETE)
// Adjunta req.userId con el UUID del usuario autenticado
export function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token de autenticación requerido.' });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.SUPABASE_JWT_SECRET;

    if (!secret) {
        // En desarrollo sin JWT configurado, permitir pasar sin validar
        console.warn('[Auth] SUPABASE_JWT_SECRET no definido — omitiendo validación JWT');
        return next();
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.userId = decoded.sub; // UUID del usuario en Supabase Auth
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido o expirado.' });
    }
}

// Rutas 
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'AgroVia API corriendo 🌾' });
});

app.use('/api', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 404 handler 
app.use((req, res) => {
    res.status(404).json({ error: `Ruta ${req.method} ${req.path} no encontrada.` });
});

// Error handler global 
app.use((err, req, res, _next) => {
    console.error('[Error global]', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
});

app.listen(port, () => {
    console.log(`🌾 AgroVia Backend corriendo en http://localhost:${port}`);
    console.log(`📚 Swagger docs: http://localhost:${port}/api-docs`);
});