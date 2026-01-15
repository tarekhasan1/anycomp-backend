// src/routes/specialist.routes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { SpecialistController } from '../controllers/specialist.controller';
import { validate } from '../middlewares/validation';
import {
  CreateSpecialistSchema,
  UpdateSpecialistSchema,
  PublishSpecialistSchema,
} from '../dtos/specialist.dto';
import { QuerySpecialistsSchema } from '../dtos/query.dto';

const router = Router();
const controller = new SpecialistController();

// Public routes
router.get('/public', validate(QuerySpecialistsSchema, 'query') as any, controller.getPublicSpecialists);

// Admin routes
router.get('/', validate(QuerySpecialistsSchema, 'query') as any, controller.getAllSpecialists);
router.get('/:id', controller.getSpecialistById);
router.post('/', validate(CreateSpecialistSchema), controller.createSpecialist);
router.put('/:id', validate(UpdateSpecialistSchema), controller.updateSpecialist);
router.patch('/:id/publish', validate(PublishSpecialistSchema), controller.publishSpecialist);
router.delete('/:id', controller.deleteSpecialist);

export default router;