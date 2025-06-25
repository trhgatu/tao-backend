import express from 'express'
import * as roleController from './role.controller'
import {
    requireAuth,
    requireRole,
    createAuditLog,
    validate
} from '@middlewares'
import { CreateRoleSchema, UpdateRoleSchema } from './role.validator'
import { LogAction } from '@shared/enums'

const router = express.Router()

router.use(requireAuth, requireRole(['admin']))

router.get('/', roleController.getAll)

router.get('/:id', roleController.getById)

router.post(
    '/create',
    validate(CreateRoleSchema),
    createAuditLog({
        action: LogAction.CREATE,
        targetModel: 'Role',
        description: (req) => `Created role ${req.body.name}`,
    }),
    roleController.create
)

router.put(
    '/update/:id',
    validate(UpdateRoleSchema),
    createAuditLog({
        action: LogAction.UPDATE,
        targetModel: 'Role',
        targetId: (req) => req.params.id,
        description: (req) => `Updated role ${req.params.id}`,
    }),
    roleController.update
)

router.delete(
    '/delete/:id',
    createAuditLog({
        action: LogAction.DELETE,
        targetModel: 'Role',
        targetId: (req) => req.params.id,
        description: (req) => `Deleted role ${req.params.id}`,
    }),
    roleController.remove
)

export default router
