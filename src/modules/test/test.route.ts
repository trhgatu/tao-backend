// src/modules/test/test.route.ts
import { Router } from 'express'
import { testValidation } from './test.controller'
import { validate } from '@middlewares/validate.middleware'
import { testSchema } from '@modules/test/test.validator'

const router = Router()

router.post('/zod', validate(testSchema), testValidation)

export default router
