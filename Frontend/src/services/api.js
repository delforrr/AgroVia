// Configuración base de Axios para las peticiones a la API.
// El interceptor inyecta el JWT de forma SINCRÓNICA desde un caché en módulo.
// AuthContext es dueño del estado de sesión y lo sincroniza aquí mediante
// setApiSession(), evitando llamadas concurrentes a supabase.auth.getSession()
// que bloqueaban requests públicos durante el refresco del token.

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

// ── Caché de sesión — actualizada exclusivamente por AuthContext ───────────────
let _session = null;

/**
 * Llamado por AuthContext cada vez que la sesión cambia.
 * Mantiene el caché sincronizado sin llamadas async adicionales.
 */
export function setApiSession(session) {
    _session = session ?? null;
}

// ── Instancia principal ────────────────────────────────────────────────────────
const api = axios.create({ baseURL: `${BASE_URL}/api` });

// Interceptor SINCRÓNICO: usa el caché directamente, sin bloquear requests
// públicos mientras Supabase refresca el token en segundo plano.
api.interceptors.request.use((config) => {
    if (_session?.access_token) {
        config.headers.Authorization = `Bearer ${_session.access_token}`;
    }
    return config;
});

export default api;

// ── Funciones de Avisos ───────────────────────────────────────────────────────

export const getAvisos = async (params = {}, axiosConfig = {}) => {
    const { data } = await api.get('/avisos', { params, ...axiosConfig });
    return Array.isArray(data) ? data : [];
};

export const postAviso = async (aviso) => {
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
