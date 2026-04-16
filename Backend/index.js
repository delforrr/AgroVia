// Punto de entrada principal para el servidor Backend

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

dotenv.config();

const swaggerDocument = JSON.parse(fs.readFileSync(new URL('./docs/swagger.json', import.meta.url)));

const app = express();
const port = process.env.PORT || 3000;

// 🛡️ Seguridad: Helmet configura diversos headers HTTP para proteger la app
app.use(helmet());

// ⚡ Seguridad: Limitador de peticiones para prevenir DoS y fuerza bruta
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Máximo 100 peticiones por ventana por IP
    message: { error: 'Demasiadas peticiones desde esta IP, intente de nuevo más tarde.' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter);

//  CORS: en producción, solo acepta el dominio de Vercel 
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:4173',
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`[CORS] Origen bloqueado: ${origin}`);
            callback(new Error(`CORS: origen no permitido → ${origin}`));
        }
    },
    credentials: true,
}));

app.use(express.json());
app.use(express.static('public'));

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

// Error handler global (no revela stack traces en producción)
app.use((err, req, res, _next) => {
    console.error('[Error global]', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
});

app.listen(port, () => {
    console.log(`🌾 AgroVia Backend corriendo en http://localhost:${port}`);
    console.log(`📚 Swagger docs: http://localhost:${port}/api-docs`);
});