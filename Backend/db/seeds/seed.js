// Script para poblar la base de datos con datos de prueba

import pg from 'pg';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { Pool } = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

// ─── Usuario de prueba (vendedor genérico) ───────────────────────────────
// IMPORTANTE: Para que el sistema de autoría funcione, este UUID debe existir 
// en auth.users y public.usuarios. 
// Pasos: 
// 1. Registrate en la app o creá un usuario en el Dashboard de Supabase.
// 2. Copiá el ID (UUID) del usuario.
// 3. Pegalo aquí si querés que los avisos del seed te pertenezcan.
const SEED_USUARIO_ID = process.env.SEED_USER_ID || null; 

// ─── Datos de prueba ─────────────────────────────────────────────────────
const avisosSeed = [
    {
        categoria: 'Hacienda',
        titulo: '50 cabezas terneros Hereford – 180 kg',
        precio: 550000, moneda: 'ARS',
        imagen: '/Images/lote hacienda 1.jpg',
        descripcion: 'Terneros de excelente calidad, pesando 180 kg promedio. Vacunados y listos para traslado.',
        provincia: 'Córdoba', localidad: 'Río Cuarto',
        attrs: { tipo_animal: 'Hereford', condicion: 'Ternero', cantidad_cabezas: 50, peso_promedio_kg: 180, sanidad: 'Vacunados al día' },
    },
    {
        categoria: 'Hacienda',
        titulo: '30 Novillos Aberdeen Angus',
        precio: 1200000, moneda: 'ARS',
        imagen: 'https://picsum.photos/id/200/400/300',
        descripcion: 'Novillos de 280 kg listos para feedlot o invernada. Sanidad al día.',
        provincia: 'Buenos Aires', localidad: 'Azul',
        attrs: { tipo_animal: 'Aberdeen Angus', condicion: 'Novillo', cantidad_cabezas: 30, peso_promedio_kg: 280, sanidad: 'Sanidad al día' },
    },
    {
        categoria: 'Maquinaria',
        titulo: 'Tractor John Deere 6125J – 2018',
        precio: 85000, moneda: 'USD',
        imagen: 'https://picsum.photos/id/1072/400/300',
        descripcion: 'Modelo 2018, 4500 horas de uso. Service oficial al día. Impecable estado.',
        provincia: 'Santa Fe', localidad: 'Rafaela',
        attrs: { marca: 'John Deere', modelo: '6125J', anio: 2018, horas_uso: 4500, tipo_maquinaria: 'Tractor' },
    },
    {
        categoria: 'Maquinaria',
        titulo: 'Sembradora Crucianelli Plantor 16 surcos',
        precio: 120000, moneda: 'USD',
        imagen: 'https://picsum.photos/id/1070/400/300',
        descripcion: '16 surcos a 52 cm. Monitor de siembra incluido. Muy poco uso.',
        provincia: 'Buenos Aires', localidad: 'Pergamino',
        attrs: { marca: 'Crucianelli', modelo: 'Plantor', anio: 2020, tipo_maquinaria: 'Sembradora' },
    },
    {
        categoria: 'Granos',
        titulo: '100 Toneladas de Maíz – Entrega inmediata',
        precio: null, moneda: 'ARS',
        imagen: 'https://picsum.photos/id/42/400/300',
        descripcion: 'Maíz disponible para carga inmediata. Calidad exportación. Humedad 14%.',
        provincia: 'Santa Fe', localidad: 'Venado Tuerto',
        attrs: { cultivo: 'Maíz', cantidad_tn: 100, humedad: '14%' },
    },
    {
        categoria: 'Granos',
        titulo: '200 Toneladas de Soja – Calidad exportación',
        precio: 380, moneda: 'USD/tn',
        imagen: 'https://picsum.photos/id/102/400/300',
        descripcion: 'Soja disponible en silo bolsa. Calidad premium. Humedad 13,5%.',
        provincia: 'La Pampa', localidad: 'Santa Rosa',
        attrs: { cultivo: 'Soja', cantidad_tn: 200, humedad: '13.5%' },
    },
    {
        categoria: 'Servicios',
        titulo: 'Servicio de pulverización aérea – disponible',
        precio: 18, moneda: 'USD/ha',
        imagen: 'https://picsum.photos/id/1040/400/300',
        descripcion: 'Avión agrícola disponible para campaña. Experiencia en toda la región pampeana.',
        provincia: 'Entre Ríos', localidad: 'Paraná',
        attrs: { tipo_servicio: 'Pulverización aérea', modalidad: 'Aéreo', disponibilidad: 'Inmediata', unidad_precio: 'USD/ha' },
    },
    {
        categoria: 'Servicios',
        titulo: 'Análisis de suelo – Laboratorio certificado',
        precio: 5500, moneda: 'ARS',
        imagen: 'https://picsum.photos/id/292/400/300',
        descripcion: 'Análisis completo: pH, materia orgánica, fósforo, potasio y microelementos.',
        provincia: 'Córdoba', localidad: 'Córdoba Capital',
        attrs: { tipo_servicio: 'Análisis de suelo', modalidad: 'Laboratorio', disponibilidad: 'Turnos disponibles', unidad_precio: 'ARS/muestra' },
    },
];

async function seed() {
    const client = await pool.connect();
    try {
        console.log('🌱 Iniciando seed de avisos...\n');

        for (const item of avisosSeed) {
            const avisoid = uuidv4();

            // 1. Insertar aviso principal
            await client.query(
                `INSERT INTO public.avisos (id, usuario_id, categoria, titulo, descripcion, precio, moneda, imagen, provincia, localidad)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                [avisoid, SEED_USUARIO_ID, item.categoria, item.titulo, item.descripcion,
                 item.precio, item.moneda, item.imagen, item.provincia, item.localidad]
            );

            // 2. Insertar atributos de categoría
            if (item.categoria === 'Hacienda') {
                const a = item.attrs;
                await client.query(
                    `INSERT INTO public.avisos_hacienda (aviso_id, tipo_animal, condicion, cantidad_cabezas, peso_promedio_kg, sanidad)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [avisoid, a.tipo_animal, a.condicion, a.cantidad_cabezas ?? null, a.peso_promedio_kg ?? null, a.sanidad ?? null]
                );
            } else if (item.categoria === 'Maquinaria') {
                const a = item.attrs;
                await client.query(
                    `INSERT INTO public.avisos_maquinaria (aviso_id, marca, modelo, anio, horas_uso, tipo_maquinaria)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [avisoid, a.marca, a.modelo, a.anio ?? null, a.horas_uso ?? null, a.tipo_maquinaria]
                );
            } else if (item.categoria === 'Granos') {
                const a = item.attrs;
                await client.query(
                    `INSERT INTO public.avisos_granos (aviso_id, cultivo, cantidad_tn, humedad)
                     VALUES ($1, $2, $3, $4)`,
                    [avisoid, a.cultivo, a.cantidad_tn ?? null, a.humedad ?? null]
                );
            } else if (item.categoria === 'Servicios') {
                const a = item.attrs;
                await client.query(
                    `INSERT INTO public.avisos_servicios (aviso_id, tipo_servicio, modalidad, disponibilidad, unidad_precio)
                     VALUES ($1, $2, $3, $4, $5)`,
                    [avisoid, a.tipo_servicio, a.modalidad, a.disponibilidad ?? null, a.unidad_precio ?? null]
                );
            }

            console.log(`  ✅ [${item.categoria}] ${item.titulo}`);
        }

        console.log('\n🎉 Seed completado exitosamente.');
    } catch (err) {
        console.error('❌ Error durante el seed:', err.message);
        throw err;
    } finally {
        client.release();
        await pool.end();
    }
}

seed().catch(() => process.exit(1));
