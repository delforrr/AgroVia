// Modelo de datos para los Avisos en la base de datos

import pool from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

const mapAviso = (row) => ({
    id: row.id,
    categoria: row.categoria,
    titulo: row.titulo,
    descripcion: row.descripcion,
    precio: row.precio ? parseFloat(row.precio) : null,
    moneda: row.moneda,
    precioTexto: row.precio
        ? (row.moneda === 'ARS' ? `$${Number(row.precio).toLocaleString('es-AR')}` : `${row.moneda} ${Number(row.precio).toLocaleString('es-AR')}`)
        : 'A consultar',
    imagen: row.imagen,
    provincia: row.provincia,
    localidad: row.localidad,
    estado: row.estado,
    created_at: row.created_at,
    // Vendedor
    usuario_id: row.usuario_id,
    vendedor: row.vendedor_nombre
        ? `${row.vendedor_nombre}${row.vendedor_apellido ? ' ' + row.vendedor_apellido : ''}`
        : 'Sin datos',
    telefono: row.vendedor_telefono,
    // Hacienda
    tipo: row.tipo_animal,
    condicion: row.condicion,
    cantidad: row.cantidad_cabezas ? `${row.cantidad_cabezas} cabezas` : null,
    peso: row.peso_promedio_kg ? `${row.peso_promedio_kg} kg` : null,
    // Maquinaria
    marca: row.marca,
    modelo: row.modelo,
    anio: row.anio,
    horas: row.horas_uso ? `${row.horas_uso.toLocaleString('es-AR')} hs` : null,
    // Granos
    cultivo: row.cultivo,
    humedad: row.humedad,
    // Servicios
    servicio: row.tipo_servicio,
    modalidad: row.modalidad,
    disponibilidad: row.disponibilidad,
});

const BASE_QUERY = `
    SELECT * FROM public.avisos_completo
    WHERE estado = 'activo'
`;

export default class Aviso {
    static async findAll(categoria, provincia) {
        const params = [];
        let query = BASE_QUERY;

        if (categoria) {
            params.push(categoria);
            query += ` AND categoria = $${params.length}`;
        }
        if (provincia) {
            params.push(provincia);
            query += ` AND provincia ILIKE $${params.length}`;
        }

        query += ' ORDER BY created_at DESC';

        const { rows } = await pool.query(query, params);
        return rows.map(mapAviso);
    }

    static async findById(id) {
        const { rows } = await pool.query(
            `SELECT * FROM public.avisos_completo WHERE id = $1`,
            [id]
        );
        return rows.length > 0 ? mapAviso(rows[0]) : null;
    }

    /**
     * Retorna el usuario_id del propietario del aviso, o null si no existe.
     * Usado por los controllers para verificar permisos sin SQL raw en la capa de presentación.
     */
    static async getOwner(id) {
        const { rows } = await pool.query(
            `SELECT usuario_id FROM public.avisos WHERE id = $1`,
            [id]
        );
        return rows.length > 0 ? rows[0].usuario_id : null;
    }

    /**
     * Retorna todos los avisos con JOIN de usuario (para el panel de admin).
     * Incluye cualquier estado, no solo 'activo'.
     */
    static async findAllAdmin() {
        const { rows } = await pool.query(
            `SELECT a.id, a.titulo, a.categoria, a.estado, a.precio, a.moneda,
                    a.provincia, a.localidad, a.created_at,
                    u.nombre AS vendedor_nombre, u.apellido AS vendedor_apellido,
                    u.email AS vendedor_email
             FROM public.avisos a
             LEFT JOIN public.usuarios u ON u.id = a.usuario_id
             ORDER BY a.created_at DESC`
        );
        return rows;
    }

    /**
     * Actualiza el estado de un aviso ('activo' | 'pausado' | 'eliminado').
     * Retorna { id, titulo, estado } o null si no existe.
     */
    static async setEstado(id, estado) {
        const { rows } = await pool.query(
            `UPDATE public.avisos SET estado = $1, updated_at = NOW()
             WHERE id = $2
             RETURNING id, titulo, estado`,
            [estado, id]
        );
        return rows[0] ?? null;
    }

    static async create(data, usuarioId) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const {
                categoria, titulo, descripcion, precio, moneda, imagen,
                provincia, localidad,
                // Hacienda
                tipo_animal, condicion, cantidad_cabezas, peso_promedio_kg, sanidad,
                // Maquinaria
                marca, modelo, anio, horas_uso, tipo_maquinaria,
                // Granos
                cultivo, cantidad_tn, humedad,
                // Servicios
                tipo_servicio, modalidad, disponibilidad, area_cobertura, unidad_precio,
            } = data;

            const { rows: [aviso] } = await client.query(
                `INSERT INTO public.avisos
                    (id, usuario_id, categoria, titulo, descripcion, precio, moneda, imagen, provincia, localidad, estado)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'activo')
                 RETURNING id`,
                [uuidv4(), usuarioId, categoria, titulo, descripcion, precio || null,
                moneda || 'ARS', imagen || null, provincia, localidad]
            );

            const aviso_id = aviso.id;

            if (categoria === 'Hacienda') {
                await client.query(
                    `INSERT INTO public.avisos_hacienda (aviso_id, tipo_animal, condicion, cantidad_cabezas, peso_promedio_kg, sanidad)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [aviso_id, tipo_animal, condicion, cantidad_cabezas || null, peso_promedio_kg || null, sanidad]
                );
            } else if (categoria === 'Maquinaria') {
                await client.query(
                    `INSERT INTO public.avisos_maquinaria (aviso_id, marca, modelo, anio, horas_uso, tipo_maquinaria)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [aviso_id, marca, modelo, anio || null, horas_uso || null, tipo_maquinaria]
                );
            } else if (categoria === 'Granos') {
                await client.query(
                    `INSERT INTO public.avisos_granos (aviso_id, cultivo, cantidad_tn, humedad)
                     VALUES ($1, $2, $3, $4)`,
                    [aviso_id, cultivo, cantidad_tn || null, humedad]
                );
            } else if (categoria === 'Servicios') {
                await client.query(
                    `INSERT INTO public.avisos_servicios (aviso_id, tipo_servicio, modalidad, disponibilidad, area_cobertura, unidad_precio)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [aviso_id, tipo_servicio, modalidad, disponibilidad, area_cobertura, unidad_precio]
                );
            }

            await client.query('COMMIT');
            return this.findById(aviso_id);
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }

    static async update(id, data) {
        const { titulo, descripcion, precio, moneda, imagen, provincia, localidad, estado } = data;
        const { rows } = await pool.query(
            `UPDATE public.avisos
             SET titulo=$1, descripcion=$2, precio=$3, moneda=$4, imagen=$5,
                 provincia=$6, localidad=$7, estado=COALESCE($8, estado), updated_at=NOW()
             WHERE id=$9
             RETURNING id`,
            [titulo, descripcion, precio || null, moneda, imagen, provincia, localidad, estado, id]
        );

        if (rows.length === 0) return null;
        return this.findById(id);
    }

    static async delete(id) {
        const { rows } = await pool.query(
            `DELETE FROM public.avisos WHERE id = $1 RETURNING id`,
            [id]
        );
        return rows.length > 0;
    }
}
