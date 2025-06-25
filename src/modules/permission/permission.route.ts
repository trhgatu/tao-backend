import express from 'express'
import * as permissionController from './permission.controller'
import {
  requireAuth,
  requireRole,
  validate,
  createAuditLog,
} from '@middlewares'
import { CreatePermissionSchema, UpdatePermissionSchema } from './dtos'
import { LogAction } from '@shared/enums'

const router = express.Router()

router.use(requireAuth, requireRole(['admin']))

router.get('/', permissionController.getAll)

router.get('/:id', permissionController.getById)

router.post(
  '/create',
  validate(CreatePermissionSchema),
  createAuditLog({
    action: LogAction.CREATE,
    targetModel: 'Permission',
    description: (req) => `Created permission ${req.body.name}`,
  }),
  permissionController.create
)

router.put(
  '/update/:id',
  validate(UpdatePermissionSchema),
  createAuditLog({
    action: LogAction.UPDATE,
    targetModel: 'Permission',
    targetId: (req) => req.params.id,
    description: (req) => `Updated permission ${req.params.id}`,
  }),
  permissionController.update
)

router.delete(
  '/delete/:id',
  createAuditLog({
    action: LogAction.DELETE,
    targetModel: 'Permission',
    targetId: (req) => req.params.id,
    description: (req) => `Deleted permission ${req.params.id}`,
  }),
  permissionController.remove
)

export default router
