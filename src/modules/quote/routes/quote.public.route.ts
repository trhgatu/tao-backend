// src/modules/quote/quote.routes.ts
import { Router } from 'express';
import * as quoteController from '../quote.controller';

const router = Router();

router.get('/', quoteController.listPublic);
router.get('/random', quoteController.getRandom);
router.get('/:id', quoteController.getByIdPublic);

export default router;
