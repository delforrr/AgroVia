// Configuración base de Axios para las peticiones a la API.
// Un interceptor inyecta automáticamente el JWT en todas las requests,
// eliminando la necesidad de pasar headers manualmente en cada llamada.

import axios from 'axios';
import { supabase } from '../lib/supabaseClient.js';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

// ── Instancia principal con baseURL configurada ────────────────────────────────
const api = axios.create({ baseURL: `${BASE_URL}/api` });

// Interceptor de request: inyecta el Bearer token si hay sesión activa
api.interceptors.request.use(async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
});

export default api;

// ── Funciones específicas de Avisos ──────────────────────────────────────────

export const getAvisos = async (params = {}) => {
    const { data } = await api.get('/avisos', { params });
    return data;
};

export const postAviso = async (aviso) => {
    // Si aviso es FormData, axios maneja el content-type automáticamente
    const { data } = await api.post('/avisos', aviso);
    return data;
};

export const putAviso = async (id, aviso) => {
    const { data } = await api.put(`/avisos/${id}`, aviso);
    return data;
};

export const deleteAviso = async (id) => {
    await api.delete(`/avisos/${id}`);
};
