import express from 'express';
import * as avisosController from '../controllers/avisosController.js';

const router = express.Router();

// GET /api/avisos — listar todos los activos (con filtros opcionales)
router.get('/', avisosController.getAvisos);

// GET /api/avisos/:id — detalle de un aviso
router.get('/:id', avisosController.getAvisoById);

// POST /api/avisos — crear un aviso con sus atributos de categoría
// (El middleware de autenticación debería ir aquí en el futuro)
router.post('/', avisosController.createAviso);

// PUT /api/avisos/:id — actualizar campos del aviso principal
router.put('/:id', avisosController.updateAviso);

// DELETE /api/avisos/:id — eliminar (soft delete → estado = 'eliminado')
router.delete('/:id', avisosController.deleteAviso);

export default router;
