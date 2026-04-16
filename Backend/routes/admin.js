// Rutas de administración — protegidas por authMiddleware + adminMiddleware
// Solo accesibles para usuarios con rol = 'admin'

import express from 'express';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.js';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

// Aplica ambos middlewares a todas las rutas de este router
router.use(authMiddleware, adminMiddleware);

// ── Estadísticas del tablero ──────────────────────────────────────────────────
// GET /api/admin/stats
router.get('/stats', adminController.getStats);

// ── Gestión de usuarios ───────────────────────────────────────────────────────
// GET  /api/admin/usuarios            — listar todos los usuarios
router.get('/usuarios', adminController.getUsuarios);

// PUT  /api/admin/usuarios/:id/rol    — cambiar rol de un usuario
router.put('/usuarios/:id/rol', adminController.setRolUsuario);

// PUT  /api/admin/usuarios/:id/estado — suspender/activar un usuario
router.put('/usuarios/:id/estado', adminController.setSuspendidoUsuario);

// ── Gestión de avisos ─────────────────────────────────────────────────────────
// GET    /api/admin/avisos            — listar TODOS los avisos (cualquier estado)
router.get('/avisos', adminController.getAllAvisos);

// PUT    /api/admin/avisos/:id/estado — cambiar estado de cualquier aviso
router.put('/avisos/:id/estado', adminController.setEstadoAviso);

// DELETE /api/admin/avisos/:id        — eliminar permanentemente cualquier aviso
router.delete('/avisos/:id', adminController.deleteAvisoAdmin);

export default router;
