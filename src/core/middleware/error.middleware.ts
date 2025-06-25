import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { AppError, sendError } from '@common'

interface MongooseValidationError {
  name: string
  errors: Record<string, { path: string; message: string }>
}

interface DuplicateKeyError {
  code: number
  keyValue: Record<string, string>
}

interface FallbackError {
  statusCode?: number
  message?: string
  stack?: string
}

export const errorHandler = (
  err: unknown,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  const env = process.env.NODE_ENV || 'development'

  // 1. AppError (có thể bọc cả ZodError)
  if (err instanceof AppError) {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'
    const errors: { path?: string; message: string }[] = []

    if (err.cause instanceof ZodError) {
      for (const e of err.cause.errors) {
        errors.push({ path: e.path.join('.'), message: e.message })
      }
    }

    return sendError({
      res,
      statusCode,
      message,
      errors,
      stack: env !== 'production' ? err.stack : undefined,
    })
  }

  // 2. Zod Error trực tiếp
  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }))

    return sendError({
      res,
      statusCode: 400,
      message: 'Validation error',
      errors,
      stack: env !== 'production' ? err.stack : undefined,
    })
  }

  // 3. Mongoose ValidationError
  if (isMongooseValidationError(err)) {
    const errors = Object.values(err.errors).map((e) => ({
      path: e.path,
      message: e.message,
    }))

    return sendError({
      res,
      statusCode: 400,
      message: 'Mongoose validation error',
      errors,
      stack: env !== 'production' ? (err as unknown as Error).stack : undefined,
    })
  }

  // 4. Duplicate key error (MongoDB)
  if (isDuplicateKeyError(err)) {
    const errors = Object.keys(err.keyValue).map((key) => ({
      path: key,
      message: `${key} must be unique`,
    }))

    return sendError({
      res,
      statusCode: 400,
      message: 'Duplicate key error',
      errors,
      stack: env !== 'production' ? (err as unknown as Error).stack : undefined,
    })
  }

  // 5. Fallback error
  const fallback = err as FallbackError

  return sendError({
    res,
    statusCode: fallback.statusCode || 500,
    message: fallback.message || 'Internal Server Error',
    errors: [],
    stack: env !== 'production' ? fallback.stack : undefined,
  })
}

// ----------------------------
// 🔍 Type Guard Helpers
// ----------------------------
function isMongooseValidationError(err: unknown): err is MongooseValidationError {
  return (
    typeof err === 'object' &&
    err !== null &&
    (err as { name?: string }).name === 'ValidationError' &&
    typeof (err as { errors?: unknown }).errors === 'object'
  )
}

function isDuplicateKeyError(err: unknown): err is DuplicateKeyError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code?: number }).code === 11000 &&
    'keyValue' in err
  )
}
