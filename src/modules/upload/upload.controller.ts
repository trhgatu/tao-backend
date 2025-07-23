import { Request, Response, NextFunction } from 'express';
import { uploadImageToSupabase } from './upload.service';
import { sendResponse, AppError } from '@common';

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const file = req.file;
    const folder = (req.query.folder as string) || '';

    if (!file) throw new AppError('No file uploaded', 400);

    const url = await uploadImageToSupabase(file.buffer, file.mimetype, folder);

    sendResponse({ res, message: 'Image uploaded', data: { url } });
  } catch (err) {
    next(err);
  }
};
