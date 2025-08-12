// src/modules/quote/quote.routes.ts
import { Router } from 'express';
import * as quoteController from '../quote.controller';
import { createAuditLog, requireAuth, validate } from '@middlewares';
import { createQuoteSchema, updateQuoteSchema } from '../dtos';
import { LogAction } from '@shared/enums';

const router = Router();

router.get('/', requireAuth, quoteController.listAdmin);
router.get('/:id', requireAuth, quoteController.getByIdAdmin);

router.post(
  '/',
  requireAuth,
  validate(createQuoteSchema),
  createAuditLog({
    action: LogAction.CREATE,
    targetModel: 'Quote',
    description: (req) =>
      `Created quote "${req.body?.i18nText?.vi?.text ?? req.body?.i18nText?.en?.text ?? '(no text)'}"`,
  }),
  quoteController.create
);
router.put(
  '/:id',
  requireAuth,
  validate(updateQuoteSchema),
  createAuditLog({
    action: LogAction.UPDATE,
    targetModel: 'Quote',
    description: (req) => `Updated quote ${req.params.id}`,
  }),
  quoteController.update
);
router.delete(
  '/hard/:id',
  requireAuth,
  createAuditLog({
    action: LogAction.DELETE,
    targetModel: 'Quote',
    description: (req) => `Hard-deleted quote ${req.params.id}`,
  }),
  quoteController.hardDelete
);
router.delete(
  '/soft/:id',
  requireAuth,
  createAuditLog({
    action: LogAction.DELETE,
    targetModel: 'Quote',
    description: (req) => `Soft-deleted quote ${req.params.id}`,
  }),
  quoteController.softDelete
);
router.put(
  '/restore/:id',
  requireAuth,
  createAuditLog({
    action: LogAction.RESTORE,
    targetModel: 'Quote',
    description: (req) => `Restored quote ${req.params.id}`,
  }),
  quoteController.restore
);

export default router;
