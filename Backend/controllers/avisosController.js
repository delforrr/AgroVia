// Controlador REST para los avisos

import Aviso from '../models/Aviso.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAvisos = asyncHandler(async (req, res) => {
    const avisos = await Aviso.findAll(req.query.categoria, req.query.provincia);
    res.json(avisos);
});

export const getAvisoById = asyncHandler(async (req, res) => {
    const aviso = await Aviso.findById(req.params.id);
    if (!aviso) return res.status(404).json({ error: 'Aviso no encontrado.' });
    res.json(aviso);
});

export const createAviso = asyncHandler(async (req, res) => {
    const data = { ...req.body };
    if (req.file) {
        data.imagen = `/uploads/${req.file.filename}`;
    } else {
        return res.status(400).json({ error: 'La imagen es obligatoria.' });
    }
    const nuevoAviso = await Aviso.create(data, req.userId || null);
    res.status(201).json(nuevoAviso);
});

export const updateAviso = asyncHandler(async (req, res) => {
    // Verificar que el usuario sea el dueño o un admin
    const ownerId = await Aviso.getOwner(req.params.id);
    if (ownerId === null) return res.status(404).json({ error: 'Aviso no encontrado.' });

    const esAdmin = req.userRol === 'admin';
    const esDuenio = ownerId === req.userId;
    if (!esAdmin && !esDuenio) {
        return res.status(403).json({ error: 'No tenés permiso para modificar este aviso.' });
    }

    const data = { ...req.body };
    if (req.file) {
        data.imagen = `/uploads/${req.file.filename}`;
    }
    const avisoActualizado = await Aviso.update(req.params.id, data);
    if (!avisoActualizado) return res.status(404).json({ error: 'Aviso no encontrado.' });
    res.json(avisoActualizado);
});

export const deleteAviso = asyncHandler(async (req, res) => {
    // Verificar que el usuario sea el dueño o un admin
    const ownerId = await Aviso.getOwner(req.params.id);
    if (ownerId === null) return res.status(404).json({ error: 'Aviso no encontrado.' });

    const esAdmin = req.userRol === 'admin';
    const esDuenio = ownerId === req.userId;
    if (!esAdmin && !esDuenio) {
        return res.status(403).json({ error: 'No tenés permiso para eliminar este aviso.' });
    }

    const success = await Aviso.delete(req.params.id);
    if (!success) return res.status(404).json({ error: 'Aviso no encontrado.' });
    res.status(204).send();
});
