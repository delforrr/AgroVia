// Modelo de datos para Negociaciones y Mensajes

import pool from '../config/db.js';

export default class Negociacion {
    /**
     * Crea una nueva negociación si no existe una activa para el mismo aviso/comprador.
     */
    static async create(avisoId, compradorId, vendedorId) {
        const { rows } = await pool.query(
            `INSERT INTO public.negociaciones (aviso_id, comprador_id, vendedor_id)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [avisoId, compradorId, vendedorId]
        );
        return rows[0];
    }

    /**
     * Busca negociaciones donde el usuario sea comprador o vendedor.
     */
    static async findByUser(userId) {
        const { rows } = await pool.query(
            `SELECT n.*, a.titulo as aviso_titulo, 
                    uc.nombre as comprador_nombre, uv.nombre as vendedor_nombre
             FROM public.negociaciones n
             JOIN public.avisos a ON a.id = n.aviso_id
             JOIN public.usuarios uc ON uc.id = n.comprador_id
             JOIN public.usuarios uv ON uv.id = n.vendedor_id
             WHERE n.comprador_id = $1 OR n.vendedor_id = $1
             ORDER BY n.updated_at DESC`,
            [userId]
        );
        return rows;
    }

    /**
     * Obtiene el detalle de una negociación con su chat.
     */
    static async findById(id, userId) {
        const { rows } = await pool.query(
            `SELECT n.*, a.titulo as aviso_titulo
             FROM public.negociaciones n
             JOIN public.avisos a ON a.id = n.aviso_id
             WHERE n.id = $1 AND (n.comprador_id = $2 OR n.vendedor_id = $2)`,
            [id, userId]
        );
        return rows[0];
    }

    /**
     * Agrega un mensaje al chat.
     */
    static async addMensaje(negociacionId, emisorId, mensaje) {
        const { rows } = await pool.query(
            `INSERT INTO public.mensajes_negociacion (negociacion_id, emisor_id, mensaje)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [negociacionId, emisorId, mensaje]
        );
        
        // Actualizamos el updated_at de la negociación
        await pool.query(
            `UPDATE public.negociaciones SET updated_at = NOW() WHERE id = $1`,
            [negociacionId]
        );
        
        return rows[0];
    }

    /**
     * Obtiene los mensajes de una negociación.
     */
    static async getMensajes(negociacionId) {
        const { rows } = await pool.query(
            `SELECT m.*, u.nombre as emisor_nombre
             FROM public.mensajes_negociacion m
             JOIN public.usuarios u ON u.id = m.emisor_id
             WHERE m.negociacion_id = $1
             ORDER BY m.created_at ASC`,
            [negociacionId]
        );
        return rows;
    }

    /**
     * Cambia el estado de la negociación.
     */
    static async updateEstado(id, estado, monto = null) {
        const query = monto 
            ? `UPDATE public.negociaciones SET estado = $1, monto_acordado = $2, updated_at = NOW() WHERE id = $3 RETURNING *`
            : `UPDATE public.negociaciones SET estado = $1, updated_at = NOW() WHERE id = $2 RETURNING *`;
        
        const params = monto ? [estado, monto, id] : [estado, id];
        const { rows } = await pool.query(query, params);
        return rows[0];
    }
}
