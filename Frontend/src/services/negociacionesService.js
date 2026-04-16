// Servicio para la gestión de negociaciones entre usuarios

import api from './api.js';

const BASE = '/negociaciones';

/**
 * Obtiene la lista de todas las negociaciones del usuario actual (como comprador o vendedor).
 */
export const getNegociaciones = async () => {
    const response = await api.get(BASE);
    return response.data;
};

/**
 * Obtiene el detalle de una negociación específica, incluyendo su historial de mensajes.
 */
export const getNegociacion = async (id) => {
    const response = await api.get(`${BASE}/${id}`);
    return response.data;
};

/**
 * Inicia una nueva negociación para un aviso específico.
 */
export const iniciarNegociacion = async (avisoId) => {
    const response = await api.post(BASE, { avisoId });
    return response.data;
};

/**
 * Envía un mensaje de chat dentro de una negociación activa.
 */
export const enviarMensaje = async (id, mensaje) => {
    const response = await api.post(`${BASE}/${id}/mensajes`, { mensaje });
    return response.data;
};

/**
 * Actualiza el estado de la negociación (ej: 'cerrada', 'caida', 'en_negociacion').
 */
export const actualizarEstado = async (id, estado, monto_acordado = null) => {
    const response = await api.put(`${BASE}/${id}/estado`, { estado, monto_acordado });
    return response.data;
};
