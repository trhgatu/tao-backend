import { Router } from 'express';
import * as blogController from './blog.controller';
import { requireAuth, createAuditLog, validate } from '@middlewares';
import { createBlogSchema } from '@modules/blog/dtos/blog.dto';
import { LogAction } from '@shared/enums';

const router = Router();

router.post(
  '/create',
  requireAuth,
  validate(createBlogSchema),
  createAuditLog({
    action: LogAction.CREATE,
    targetModel: 'Blog',
    description: (req) => `Created blog ${req.body.title}`,
  }),
  blogController.create
);
router.get('/', blogController.getAll);
router.get('/:id', blogController.getById);
router.put('/update/:id', blogController.update);
router.delete('/hard-delete/:id', blogController.hardDelete);

export default router;
