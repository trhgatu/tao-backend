import mongoose, { Schema, Document } from 'mongoose';
import { ContentStatusEnum } from '@shared/enums';

export interface IJournal extends Document {
  _id: mongoose.Types.ObjectId;
  rawContent: string;
  date?: Date;
  translations: Map<string, string>;
  autoTranslated: boolean;
  status: ContentStatusEnum;
  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean;
}

const journalSchema: Schema<IJournal> = new Schema(
  {
    rawContent: { type: String },
    date: { type: Date, default: () => new Date() },
    translations: {
      type: Map,
      of: String,
      default: {},
    },
    autoTranslated: { type: Boolean, default: false },
    status: {
      type: String,
      enum: Object.values(ContentStatusEnum),
      default: ContentStatusEnum.PRIVATE,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Journal = mongoose.model<IJournal>('Journal', journalSchema, 'journals');
export default Journal;
