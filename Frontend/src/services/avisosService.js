import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const avisosApi = axios.create({
    baseURL: `${BASE_URL}/avisos`,
    headers: { 'Content-Type': 'application/json' },
});

/** GET /api/avisos?categoria=&provincia=&precioMin=&precioMax=&busqueda= */
export const getAvisos = async (filters = {}) => {
    const { data } = await avisosApi.get('/', { params: filters });
    return data;
};

/** GET /api/avisos/:id */
export const getAvisoById = async (id) => {
    const { data } = await avisosApi.get(`/${id}`);
    return data;
};

/** POST /api/avisos  (FormData para imagenes con multer) */
export const createAviso = async (formData) => {
    const { data } = await avisosApi.post('/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
};

/** PUT /api/avisos/:id */
export const updateAviso = async (id, payload) => {
    const { data } = await avisosApi.put(`/${id}`, payload);
    return data;
};

/** DELETE /api/avisos/:id */
export const deleteAviso = async (id) => {
    const { data } = await avisosApi.delete(`/${id}`);
    return data;
};
