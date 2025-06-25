// src/core/middleware/not-found.middleware.ts
import { Request, Response, NextFunction } from 'express'

export const notFound = (req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: `🔍 Not Found: ${req.originalUrl}`,
  })
}
