// Configuración base de Axios para las peticiones a la API.
// Un interceptor inyecta automáticamente el JWT en todas las requests,
// eliminando la necesidad de pasar headers manualmente en cada llamada.
// La sesión se cachea en memoria para evitar latencia adicional en cada request.

import axios from 'axios';
import { supabase } from '../lib/supabaseClient.js';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

// ── Caché de sesión para evitar llamadas async repetidas ──────────────────────
let _cachedSession = undefined; // undefined = no inicializado aún

// Inicializar caché y suscribirse a cambios de auth
supabase.auth.getSession().then(({ data: { session } }) => {
    _cachedSession = session;
});
supabase.auth.onAuthStateChange((_event, session) => {
    _cachedSession = session;
});

// ── Instancia principal con baseURL configurada ────────────────────────────────
const api = axios.create({ baseURL: `${BASE_URL}/api` });

// Interceptor de request: inyecta el Bearer token si hay sesión activa
// Usa el caché en memoria; si aún no se inicializó, hace la llamada original.
api.interceptors.request.use(async (config) => {
    let session = _cachedSession;
    if (session === undefined) {
        // Primera carga: aún no llegó el resultado del getSession inicial
        const { data } = await supabase.auth.getSession();
        session = data.session;
        _cachedSession = session;
    }
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
