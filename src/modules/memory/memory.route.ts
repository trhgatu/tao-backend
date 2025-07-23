import { Router } from 'express';
import * as memoryController from './memory.controller';
import { validate } from '@middlewares';
import { createMemorySchema } from '@modules/memory/dtos';

const router = Router();

router.get('/', memoryController.getAll);
router.get('/:id', memoryController.getById);
router.post('/create', validate(createMemorySchema), memoryController.create);
router.put('/update/:id', memoryController.update);
router.delete('/hard-delete/:id', memoryController.hardDelete);
router.delete('/soft-delete/:id', memoryController.softDelete);

export default router;
