// src/modules/quote/quote.model.ts
import mongoose, { Schema, Document, model, Types } from 'mongoose';
import { ContentStatusEnum } from '@shared/enums';
import { LocaleCode, pickLocaleText } from '@core';

export interface LocaleText {
  text: string;
  auto?: boolean;
  updatedAt?: Date;
  updatedBy?: Types.ObjectId;
}
const LocaleTextSchema = new Schema<LocaleText>(
  {
    text: { type: String, required: true },
    auto: { type: Boolean, default: false },
    updatedAt: { type: Date },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { _id: false }
);

export interface IQuote extends Document {
  _id: mongoose.Types.ObjectId;
  i18nText: Map<LocaleCode, LocaleText>;
  i18nAuthor?: Map<LocaleCode, LocaleText>;
  tags?: string[];
  status: ContentStatusEnum;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean;

  getLocalized(lang?: LocaleCode): { text: string; author?: string };
}

const quoteSchema = new Schema<IQuote>(
  {
    i18nText: { type: Map, of: LocaleTextSchema, default: {} },
    i18nAuthor: { type: Map, of: LocaleTextSchema, default: undefined },
    tags: [{ type: String }],
    status: {
      type: String,
      enum: Object.values(ContentStatusEnum),
      default: ContentStatusEnum.DRAFT,
    },
    publishedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

quoteSchema.index({ isDeleted: 1, status: 1, createdAt: -1 });

quoteSchema.methods.getLocalized = function (lang: LocaleCode = 'vi') {
  return {
    text: pickLocaleText(this.i18nText, lang),
    author: this.i18nAuthor ? pickLocaleText(this.i18nAuthor, lang) : undefined,
  };
};

const Quote = model<IQuote>('Quote', quoteSchema, 'quotes');
export default Quote;
