import axios from 'axios';
import { supabase } from '../lib/supabaseClient.js';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
const BASE = `${BASE_URL}/api/avisos`;

// Headers con JWT para rutas protegidas (POST, PUT, DELETE)
async function getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return {};
    return { Authorization: `Bearer ${session.access_token}` };
}

export const getAvisos = async (params = {}) => {
    const response = await axios.get(BASE, { params });
    return response.data;
};

export const postAviso = async (aviso) => {
    const headers = await getAuthHeaders();
    // Si aviso es FormData, axios maneja el content-type automáticamente
    const response = await axios.post(BASE, aviso, { headers });
    return response.data;
};

export const putAviso = async (id, aviso) => {
    const headers = await getAuthHeaders();
    const response = await axios.put(`${BASE}/${id}`, aviso, { headers });
    return response.data;
};

export const deleteAviso = async (id) => {
    const headers = await getAuthHeaders();
    await axios.delete(`${BASE}/${id}`, { headers });
};
