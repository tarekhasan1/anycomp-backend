// src/routes/index.ts
import { Router } from 'express';
import specialistRoutes from './specialist.routes';

const router = Router();

router.use('/specialists', specialistRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;