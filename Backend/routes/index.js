import express from 'express';
import avisosRoutes from './avisos.js';

const router = express.Router();

// Agrega aquí todas tus rutas
router.use('/avisos', avisosRoutes);
// Ejemplo para futuras rutas: router.use('/usuarios', usuariosRoutes);

export default router;
