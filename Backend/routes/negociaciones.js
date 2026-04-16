// Rutas para la gestión de negociaciones — protegidas por authMiddleware

import express from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import * as negociacionesController from '../controllers/negociacionesController.js';

const router = express.Router();

// Todas las rutas de negociaciones requieren autenticación
router.use(authMiddleware);

// GET /api/negociaciones — listar negociaciones del usuario
router.get('/', negociacionesController.getNegociaciones);

// POST /api/negociaciones — iniciar una negociación nueva
router.post('/', negociacionesController.createNegociacion);

// GET /api/negociaciones/:id — detalle y chat de una negociación
router.get('/:id', negociacionesController.getNegociacionById);

// POST /api/negociaciones/:id/mensajes — enviar mensaje al chat
router.post('/:id/mensajes', negociacionesController.addMensaje);

// PUT /api/negociaciones/:id/estado — actualizar estado (cerrar, cancelar, etc)
router.put('/:id/estado', negociacionesController.updateEstado);

export default router;
