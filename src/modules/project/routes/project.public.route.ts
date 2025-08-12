import { Router } from 'express';
import * as projectController from '../project.controller';

const router = Router();

router.get('/', projectController.listPublic);
router.get('/:slug', projectController.getBySlugPublic);

export default router;
