import { Schema, Document, model, Types } from 'mongoose';
import { ContentStatusEnum } from '@shared/enums';

export interface IQuote extends Document {
  _id: Types.ObjectId;
  text: string;
  author?: string;
  tags?: string[];
  translations: Map<string, string>;
  autoTranslated: boolean;
  status: ContentStatusEnum;
  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean;
}

const quoteSchema = new Schema<IQuote>(
  {
    text: { type: String, required: true, trim: true },
    author: { type: String, trim: true },
    tags: [{ type: String }],
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

const Quote = model<IQuote>('Quote', quoteSchema, 'quotes');
export default Quote;
