// Archivo para la conexión a la base de datos

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
    console.warn('[DB] ⚠️  DATABASE_URL no definida — usando datos mock en memoria');
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
    console.error('[DB] Error inesperado en el pool de conexiones:', err.message);
});

pool.on('connect', () => {
    console.log('[DB] ✅ Conexión establecida con Supabase PostgreSQL');
});

export default pool;
