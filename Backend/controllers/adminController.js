// Controlador REST para las rutas de administración
// Gestión de usuarios y avisos con privilegios de admin

import Usuario from '../models/Usuario.js';
import Aviso from '../models/Aviso.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// ── STATS ──────────────────────────────────────────────────────────────────────

export const getStats = asyncHandler(async (req, res) => {
    const stats = await Usuario.getStats();
    res.json(stats);
});

// ── USUARIOS ───────────────────────────────────────────────────────────────────

export const getUsuarios = asyncHandler(async (req, res) => {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
});

export const setRolUsuario = asyncHandler(async (req, res) => {
    const { rol } = req.body;
    if (!rol || !['usuario', 'admin'].includes(rol)) {
        return res.status(400).json({ error: 'Rol inválido. Debe ser "usuario" o "admin".' });
    }

    // Un admin no puede quitarse su propio rol
    if (req.params.id === req.userId) {
        return res.status(400).json({ error: 'No podés modificar tu propio rol.' });
    }

    const usuario = await Usuario.setRol(req.params.id, rol);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado.' });
    res.json(usuario);
});

export const setSuspendidoUsuario = asyncHandler(async (req, res) => {
    const { suspendido } = req.body;
    if (typeof suspendido !== 'boolean') {
        return res.status(400).json({ error: 'El campo "suspendido" debe ser booleano.' });
    }

    // Un admin no puede suspenderse a sí mismo
    if (req.params.id === req.userId) {
        return res.status(400).json({ error: 'No podés suspender tu propia cuenta.' });
    }

    const usuario = await Usuario.setSuspendido(req.params.id, suspendido);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado.' });
    res.json(usuario);
});

// ── AVISOS ─────────────────────────────────────────────────────────────────────

export const getAllAvisos = asyncHandler(async (req, res) => {
    // El admin puede ver TODOS los avisos, sin importar el estado
    const avisos = await Aviso.findAllAdmin();
    res.json(avisos);
});

export const setEstadoAviso = asyncHandler(async (req, res) => {
    const { estado } = req.body;
    const estadosValidos = ['activo', 'pausado', 'eliminado'];
    if (!estadosValidos.includes(estado)) {
        return res.status(400).json({ error: `Estado inválido. Debe ser uno de: ${estadosValidos.join(', ')}.` });
    }

    const aviso = await Aviso.setEstado(req.params.id, estado);
    if (!aviso) return res.status(404).json({ error: 'Aviso no encontrado.' });
    res.json(aviso);
});

export const deleteAvisoAdmin = asyncHandler(async (req, res) => {
    const success = await Aviso.delete(req.params.id);
    if (!success) return res.status(404).json({ error: 'Aviso no encontrado.' });
    res.status(204).send();
});
