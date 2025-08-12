import { Router } from 'express';
import * as projectController from '../project.controller';
import { requireAuth, validate, createAuditLog } from '@middlewares';
import { createProjectSchema, updateProjectSchema } from '../dtos';
import { LogAction } from '@shared/enums';

const router = Router();

router.get('/', requireAuth, projectController.listAdmin);
router.get('/:id', requireAuth, projectController.getByIdAdmin);

router.post(
  '/',
  requireAuth,
  validate(createProjectSchema),
  createAuditLog({
    action: LogAction.CREATE,
    targetModel: 'Project',
    description: (req) => `Created project "${req.body?.slug ?? '(no slug)'}"`,
  }),
  projectController.create
);

router.put(
  '/:id',
  requireAuth,
  validate(updateProjectSchema),
  createAuditLog({
    action: LogAction.UPDATE,
    targetModel: 'Project',
    description: (req) => `Updated project ${req.params.id}`,
  }),
  projectController.update
);

router.delete(
  '/soft/:id',
  requireAuth,
  createAuditLog({
    action: LogAction.DELETE,
    targetModel: 'Project',
    description: (req) => `Soft-deleted project ${req.params.id}`,
  }),
  projectController.softDelete
);

router.put(
  '/restore/:id',
  requireAuth,
  createAuditLog({
    action: LogAction.RESTORE,
    targetModel: 'Project',
    description: (req) => `Restored project ${req.params.id}`,
  }),
  projectController.restore
);

router.delete(
  '/hard/:id',
  requireAuth,
  createAuditLog({
    action: LogAction.DELETE,
    targetModel: 'Project',
    description: (req) => `Hard-deleted project ${req.params.id}`,
  }),
  projectController.hardDelete
);

export default router;
