import express from 'express'
import * as userController from './user.controller'
import { requireAuth, validate, createAuditLog } from '@middlewares'
import { LogAction } from '@shared/enums'

import { UpdateProfileSchema } from './dtos'

const router = express.Router()

router.get('/me', requireAuth, userController.getMe)

router.put(
    '/update/me',
    requireAuth,
    validate(UpdateProfileSchema),
    createAuditLog({
        action: LogAction.UPDATE_PROFILE,
        targetModel: 'User',
        targetId: (req) => req.user!._id,
        description: (req) => `User ${req.user!.email} updated their profile`,
    }),
    userController.updateMe
)

router.get('/', requireAuth, userController.getAllUsers)

export default router
