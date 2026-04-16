// Modelo de datos para la gestión de usuarios (solo acceso admin)

import pool from '../config/db.js';

export default class Usuario {
    /**
     * Devuelve todos los usuarios de la plataforma.
     * Solo accesible por admins.
     */
    static async findAll() {
        const { rows } = await pool.query(
            `SELECT id, nombre, apellido, email, rol, suspendido, provincia, localidad, created_at
             FROM public.usuarios
             ORDER BY created_at DESC`
        );
        return rows;
    }

    /**
     * Busca un usuario por su UUID.
     */
    static async findById(id) {
        const { rows } = await pool.query(
            `SELECT id, nombre, apellido, email, rol, suspendido, provincia, localidad, created_at
             FROM public.usuarios
             WHERE id = $1`,
            [id]
        );
        return rows[0] ?? null;
    }

    /**
     * Cambia el rol de un usuario ('usuario' | 'admin').
     */
    static async setRol(id, rol) {
        if (!['usuario', 'admin'].includes(rol)) {
            throw new Error(`Rol inválido: ${rol}`);
        }
        const { rows } = await pool.query(
            `UPDATE public.usuarios SET rol = $1, updated_at = NOW()
             WHERE id = $2
             RETURNING id, nombre, apellido, email, rol, suspendido`,
            [rol, id]
        );
        return rows[0] ?? null;
    }

    /**
     * Activa o suspende la cuenta de un usuario.
     */
    static async setSuspendido(id, suspendido) {
        const { rows } = await pool.query(
            `UPDATE public.usuarios SET suspendido = $1, updated_at = NOW()
             WHERE id = $2
             RETURNING id, nombre, apellido, email, rol, suspendido`,
            [suspendido, id]
        );
        return rows[0] ?? null;
    }

    /**
     * Devuelve estadísticas del tablero admin con valores numéricos correctos.
     * PostgreSQL devuelve COUNT como bigint (string) — los parseamos acá.
     */
    static async getStats() {
        const { rows } = await pool.query(`
            SELECT
                (SELECT COUNT(*) FROM public.usuarios)                                              AS total_usuarios,
                (SELECT COUNT(*) FROM public.usuarios WHERE rol = 'admin')                         AS total_admins,
                (SELECT COUNT(*) FROM public.usuarios WHERE suspendido = TRUE)                     AS usuarios_suspendidos,
                (SELECT COUNT(*) FROM public.usuarios WHERE created_at >= NOW() - INTERVAL '30 days') AS nuevos_este_mes,
                (SELECT COUNT(*) FROM public.avisos)                                               AS total_avisos,
                (SELECT COUNT(*) FROM public.avisos WHERE estado = 'activo')                       AS avisos_activos,
                (SELECT COUNT(*) FROM public.avisos WHERE estado = 'pausado')                      AS avisos_pausados,
                (SELECT COUNT(*) FROM public.avisos WHERE estado = 'eliminado')                    AS avisos_eliminados,
                (SELECT COUNT(DISTINCT usuario_id) FROM public.avisos WHERE estado = 'activo')     AS vendedores_activos
        `);

        const r = rows[0];
        // PostgreSQL devuelve bigint como string — convertir a número
        return {
            total_usuarios:       parseInt(r.total_usuarios,       10),
            total_admins:         parseInt(r.total_admins,         10),
            usuarios_suspendidos: parseInt(r.usuarios_suspendidos, 10),
            nuevos_este_mes:      parseInt(r.nuevos_este_mes,      10),
            total_avisos:         parseInt(r.total_avisos,         10),
            avisos_activos:       parseInt(r.avisos_activos,       10),
            avisos_pausados:      parseInt(r.avisos_pausados,      10),
            avisos_eliminados:    parseInt(r.avisos_eliminados,    10),
            vendedores_activos:   parseInt(r.vendedores_activos,   10),
        };
    }
}
