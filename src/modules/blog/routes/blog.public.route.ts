// src/modules/blog/blog.route.ts
import { Router } from 'express';
import * as blogController from '../blog.controller';

const router = Router();

router.get('/', blogController.listPublic);

// GET BY SLUG
/* router.get('/slug/:slug', blogController.getBySlug); */

// GET BY ID
/* router.get('/:id', blogController.getById); */

export default router;
