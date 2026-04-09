// Definición de rutas para el recurso de Avisos

import express from 'express';
import * as avisosController from '../controllers/avisosController.js';
import upload from '../middlewares/upload.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// GET /api/avisos — listar todos los activos (con filtros opcionales)
router.get('/', avisosController.getAvisos);

// GET /api/avisos/:id — detalle de un aviso
router.get('/:id', avisosController.getAvisoById);

// POST /api/avisos — crear un aviso (requiere JWT válido)
router.post('/', authMiddleware, upload.single('imagen'), avisosController.createAviso);

// PUT /api/avisos/:id — actualizar un aviso propio (requiere JWT válido)
router.put('/:id', authMiddleware, upload.single('imagen'), avisosController.updateAviso);

// DELETE /api/avisos/:id — eliminar (soft delete, requiere JWT válido)
router.delete('/:id', authMiddleware, avisosController.deleteAviso);

export default router;
