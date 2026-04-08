import Aviso from '../models/Aviso.js';

export const getAvisos = async (req, res) => {
    try {
        const avisos = await Aviso.findAll(req.query.categoria, req.query.provincia);
        res.json(avisos);
    } catch (err) {
        console.error('[GET /avisos]', err.message);
        res.status(500).json({ error: 'Error al obtener los avisos.' });
    }
};

export const getAvisoById = async (req, res) => {
    try {
        const aviso = await Aviso.findById(req.params.id);
        if (!aviso) return res.status(404).json({ error: 'Aviso no encontrado.' });
        res.json(aviso);
    } catch (err) {
        console.error('[GET /avisos/:id]', err.message);
        res.status(500).json({ error: 'Error al obtener el aviso.' });
    }
};

export const createAviso = async (req, res) => {
    try {
        const nuevoAviso = await Aviso.create(req.body, req.userId || null);
        res.status(201).json(nuevoAviso);
    } catch (err) {
        console.error('[POST /avisos]', err.message);
        res.status(500).json({ error: 'Error al crear el aviso.' });
    }
};

export const updateAviso = async (req, res) => {
    try {
        const avisoActualizado = await Aviso.update(req.params.id, req.body);
        if (!avisoActualizado) return res.status(404).json({ error: 'Aviso no encontrado.' });
        res.json(avisoActualizado);
    } catch (err) {
        console.error('[PUT /avisos/:id]', err.message);
        res.status(500).json({ error: 'Error al actualizar el aviso.' });
    }
};

export const deleteAviso = async (req, res) => {
    try {
        const success = await Aviso.delete(req.params.id);
        if (!success) return res.status(404).json({ error: 'Aviso no encontrado.' });
        res.status(204).send();
    } catch (err) {
        console.error('[DELETE /avisos/:id]', err.message);
        res.status(500).json({ error: 'Error al eliminar el aviso.' });
    }
};
