import express from 'express';
import avisosRoutes from './avisos.js';
import adminRoutes from './admin.js';
import negociacionesRoutes from './negociaciones.js';

const router = express.Router();

router.use('/avisos', avisosRoutes);
router.use('/admin', adminRoutes);
router.use('/negociaciones', negociacionesRoutes);

export default router;
