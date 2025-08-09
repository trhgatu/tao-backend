// src/modules/memory/memory.model.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import slugify from 'slugify';
import { ContentStatusEnum, MemoryMoodEnum } from '@shared/enums';
import { removeVietnameseTones, LocaleCode, pickLocale } from '@core';

export interface LocaleText {
  text: string;
  auto?: boolean;
  updatedAt?: Date;
  updatedBy?: mongoose.Types.ObjectId;
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

export interface IMemory extends Document {
  _id: mongoose.Types.ObjectId;
  i18nTitle: Map<LocaleCode, LocaleText>;
  i18nDescription: Map<LocaleCode, LocaleText>;
  slug: string;
  imageUrl?: string;
  location?: string;
  mood: MemoryMoodEnum;
  date?: Date;
  tags?: string[];
  status: ContentStatusEnum;
  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean;
  deletedAt?: Date;
  publishedAt?: Date;
  getLocalized(lang?: LocaleCode): { title: string; description: string };
}
type MemoryModelType = Model<IMemory>;

const memorySchema = new Schema<IMemory, MemoryModelType>(
  {
    i18nTitle: { type: Map, of: LocaleTextSchema, default: {} },
    i18nDescription: { type: Map, of: LocaleTextSchema, default: {} },
    slug: { type: String, unique: true },
    imageUrl: { type: String },
    location: { type: String },
    mood: {
      type: String,
      enum: Object.values(MemoryMoodEnum),
      default: MemoryMoodEnum.PEACEFUL,
    },
    date: { type: Date },
    tags: [{ type: String }],
    status: {
      type: String,
      enum: Object.values(ContentStatusEnum),
      default: ContentStatusEnum.DRAFT,
    },
    publishedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

memorySchema.index({ isDeleted: 1, status: 1, date: -1 });
memorySchema.index({ slug: 1 }, { unique: true });

memorySchema.methods.getLocalized = function (lang: LocaleCode = 'vi') {
  return {
    title: pickLocale(this.i18nTitle, lang),
    description: pickLocale(this.i18nDescription, lang),
  };
};

memorySchema.pre<IMemory>('validate', async function (next) {
  if (!this.isNew && !this.isModified('i18nTitle')) return next();

  const baseTitle =
    this.i18nTitle.get('vi')?.text ||
    this.i18nTitle.get('en')?.text ||
    'memory';

  const normalizedTitle = removeVietnameseTones(baseTitle);
  const baseSlug =
    slugify(normalizedTitle || 'memory', { lower: true, strict: true }) ||
    'memory';

  let slug = baseSlug,
    count = 1;
  const MemoryModel = this.constructor as MemoryModelType;
  while (await MemoryModel.exists({ slug })) slug = `${baseSlug}-${count++}`;

  this.slug = slug;
  next();
});

export default mongoose.model<IMemory, MemoryModelType>(
  'Memory',
  memorySchema,
  'memories'
);
