// src/modules/blog/blog.route.ts
import { Router } from 'express';
import * as blogController from './blog.controller';
import { requireAuth, createAuditLog, validate } from '@middlewares';
import { createBlogSchema } from '@modules/blog/dtos/create-blog.dto';
import { updateBlogSchema } from '@modules/blog/dtos/update-blog.dto';
import { LogAction } from '@shared/enums';

const router = Router();

// CREATE
router.post(
  '/',
  requireAuth,
  validate(createBlogSchema),
  createAuditLog({
    action: LogAction.CREATE,
    targetModel: 'Blog',
    description: (req) =>
      `Created blog ${
        req.body?.i18nTitle?.vi?.text ??
        req.body?.i18nTitle?.en?.text ??
        '(no title)'
      }`,
  }),
  blogController.create
);

// LIST
router.get('/', blogController.getAll);

// GET BY SLUG (đặt trước /:id để không bị nuốt)
router.get('/slug/:slug', blogController.getBySlug);

// GET BY ID
router.get('/:id', blogController.getById);

// UPDATE
router.put(
  '/:id',
  requireAuth,
  validate(updateBlogSchema),
  createAuditLog({
    action: LogAction.UPDATE,
    targetModel: 'Blog',
    description: (req) => `Updated blog ${req.params.id}`,
  }),
  blogController.update
);

// HARD DELETE
router.delete(
  '/:id',
  requireAuth,
  createAuditLog({
    action: LogAction.DELETE,
    targetModel: 'Blog',
    description: (req) => `Hard delete blog ${req.params.id}`,
  }),
  blogController.hardDelete
);

export default router;
