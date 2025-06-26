import { Router } from 'express';
import * as memoryController from './memory.controller';

const router = Router();

router.get('/', memoryController.getAll);
router.get('/:id', memoryController.getById);
router.post('/create', memoryController.create);
router.put('/update/:id', memoryController.update);
router.delete('/hard-delete/:id', memoryController.hardDelete);

export default router;
