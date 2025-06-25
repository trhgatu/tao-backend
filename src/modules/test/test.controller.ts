// src/modules/test/test.controller.ts
import { Request, Response, NextFunction } from 'express'
import { testSchema } from './test.validator'
import { AppError } from '@common/app-error'

export const testValidation = (req: Request, res: Response, next: NextFunction) => {
  try {
    testSchema.parse(req.body)
    res.json({ success: true, message: 'Passed validation' })
  } catch (err) {
    next(new AppError('Failed to fetch data', 500, true, err))
  }
}
