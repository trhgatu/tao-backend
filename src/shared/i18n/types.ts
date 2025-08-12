import type { Types } from 'mongoose';

export interface LocaleText {
  text: string;
  auto?: boolean;
  updatedAt?: Date;
  updatedBy?: Types.ObjectId;
}
