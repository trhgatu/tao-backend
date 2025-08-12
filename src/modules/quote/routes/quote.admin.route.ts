// src/modules/quote/quote.routes.ts
import { Router } from 'express';
import * as quoteController from '../quote.controller';
import { requireAuth, validate } from '@middlewares';
import { createQuoteSchema, updateQuoteSchema } from '../dtos';

const router = Router();

router.get('/', requireAuth, quoteController.listAdmin);
router.get('/:id', requireAuth, quoteController.getByIdAdmin);

router.post(
  '/',
  requireAuth,
  validate(createQuoteSchema),
  quoteController.create
);
router.put(
  '/:id',
  requireAuth,
  validate(updateQuoteSchema),
  quoteController.update
);
router.delete('/hard/:id', requireAuth, quoteController.hardDelete);
router.delete('/soft/:id', requireAuth, quoteController.softDelete);
router.put('/restore/:id', requireAuth, quoteController.restore);

export default router;
