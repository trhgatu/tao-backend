import { Response } from 'express'

interface IErrorResponse {
  res: Response
  statusCode?: number
  message: string
  errors?: unknown[]
  stack?: string
}

interface ErrorJsonResponse {
  success: false
  message: string
  errors?: unknown[]
  stack?: string
}

export const sendError = ({ res, statusCode = 500, message, errors, stack }: IErrorResponse) => {
  const response: ErrorJsonResponse = {
    success: false,
    message,
  }

  if (errors && errors.length) {
    response.errors = errors
  }

  if (process.env.NODE_ENV !== 'production' && stack) {
    response.stack = stack
  }

  return res.status(statusCode).json(response)
}
