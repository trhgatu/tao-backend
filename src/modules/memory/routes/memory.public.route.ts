// src/modules/memory/memory.routes.ts
import { Router } from 'express';
import * as memoryController from '../memory.controller';

const router = Router();

// LIST

router.get('/', memoryController.listPublic);

// GET BY SLUG
router.get('/:slug', memoryController.getBySlug);

export default router;
