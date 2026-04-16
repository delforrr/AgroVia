// Controlador para la gestión de negociaciones entre usuarios

import Negociacion from '../models/Negociacion.js';
import Aviso from '../models/Aviso.js';

export const getNegociaciones = async (req, res) => {
    try {
        const userId = req.userId;
        const result = await Negociacion.findByUser(userId);
        res.json(result);
    } catch (err) {
        console.error('[GET /negociaciones]', err.message);
        res.status(500).json({ error: 'Error al obtener negociaciones.' });
    }
};

export const createNegociacion = async (req, res) => {
    try {
        const { avisoId } = req.body;
        const compradorId = req.userId;

        // Validar que el aviso exista y obtener el vendedor
        const aviso = await Aviso.findById(avisoId);
        if (!aviso) return res.status(404).json({ error: 'Aviso no encontrado.' });
        if (aviso.usuario_id === compradorId) return res.status(400).json({ error: 'No podés iniciar una negociación con vos mismo.' });

        const result = await Negociacion.create(avisoId, compradorId, aviso.usuario_id);
        res.status(201).json(result);
    } catch (err) {
        console.error('[POST /negociaciones]', err.message);
        res.status(500).json({ error: 'Error al iniciar negociación.' });
    }
};

export const getNegociacionById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const negociacion = await Negociacion.findById(id, userId);
        if (!negociacion) return res.status(404).json({ error: 'Negociación no encontrada.' });

        const mensajes = await Negociacion.getMensajes(id);
        res.json({ ...negociacion, mensajes });
    } catch (err) {
        console.error('[GET /negociaciones/:id]', err.message);
        res.status(500).json({ error: 'Error al obtener detalle.' });
    }
};

export const addMensaje = async (req, res) => {
    try {
        const { id } = req.params;
        const { mensaje } = req.body;
        const userId = req.userId;

        // Verificar que el usuario sea parte de la negociación
        const negociacion = await Negociacion.findById(id, userId);
        if (!negociacion) return res.status(403).json({ error: 'No tenés acceso a esta negociación.' });

        const result = await Negociacion.addMensaje(id, userId, mensaje);
        res.status(201).json(result);
    } catch (err) {
        console.error('[POST /negociaciones/:id/mensajes]', err.message);
        res.status(500).json({ error: 'Error al enviar mensaje.' });
    }
};

export const updateEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado, monto_acordado } = req.body;
        const userId = req.userId;

        // Verificar permisos
        const negociacion = await Negociacion.findById(id, userId);
        if (!negociacion) return res.status(403).json({ error: 'No tenés acceso.' });

        const result = await Negociacion.updateEstado(id, estado, monto_acordado);
        res.json(result);
    } catch (err) {
        console.error('[PUT /negociaciones/:id/estado]', err.message);
        res.status(500).json({ error: 'Error al actualizar estado.' });
    }
};
