import { Router } from 'express';
import * as templateController from './log.controller';

const router = Router();

router.get('/', templateController.getAll);
router.get('/:id', templateController.getById);
router.post('/', templateController.create);
router.put('/:id', templateController.update);
router.delete('/:id', templateController.remove);

export default router;
