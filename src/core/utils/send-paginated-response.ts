// src/core/utils/response.ts
import { Response } from 'express';

interface IPaginatedResponse<T> {
  res: Response;
  statusCode?: number;
  success?: boolean;
  message: string;
  data: T[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export const sendPaginatedResponse = <T>({
  res,
  statusCode = 200,
  success = true,
  message,
  data,
  total,
  currentPage,
  totalPages,
}: IPaginatedResponse<T>) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
    total,
    currentPage,
    totalPages,
  });
};
