import { ZodSchema } from 'zod'
import { Request, Response, NextFunction } from 'express'
import { AppError } from '@common/app-error'

export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body)
        if (!result.success) {
            return next(new AppError('Validation error', 400, true, result.error));
        }
        req.body = result.data
        next()
    }
}
