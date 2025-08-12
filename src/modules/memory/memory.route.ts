// src/modules/memory/memory.routes.ts
import { Router } from 'express';
import * as memoryController from './memory.controller';
import { createAuditLog, requireAuth, validate } from '@middlewares';
import { createMemorySchema, updateMemorySchema } from './dtos';
import { LogAction } from '@shared/enums';

const router = Router();

// LIST
router.get('/', requireAuth, memoryController.getAll);

// GET BY SLUG
router.get('/slug/:slug', memoryController.getBySlug);

// GET BY ID
router.get('/:id', memoryController.getById);

// CREATE
router.post(
  '/',
  requireAuth,
  validate(createMemorySchema),
  createAuditLog({
    action: LogAction.CREATE,
    targetModel: 'Memory',
    description: (req) =>
      `Create Memory ${
        req.body?.i18nTitle?.vi.text ??
        req.body?.i18nTitle?.en.text ??
        '(no title)'
      }`,
  }),
  memoryController.create
);
router.put(
  '/:id',
  requireAuth,
  validate(updateMemorySchema),
  createAuditLog({
    action: LogAction.UPDATE,
    targetModel: 'Memory',
    description: (req) => `Updated memory ${req.params.id}`,
  }),
  memoryController.update
);

//HARD DELETE
router.delete(
  '/hard/:id',
  requireAuth,
  createAuditLog({
    action: LogAction.DELETE,
    targetModel: 'Memory',
    description: (req) => `Hard delete memory ${req.params.id}`,
  }),
  memoryController.hardDelete
);

// SOFT DELETE
router.delete('/soft/:id', memoryController.softDelete);

export default router;
