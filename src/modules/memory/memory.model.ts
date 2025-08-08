import mongoose, { Schema, Document } from 'mongoose';
import slugify from 'slugify';
import { ContentStatusEnum, MemoryMoodEnum } from '@shared/enums';
import { removeVietnameseTones } from '@core';

export interface IMemory extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  location?: string;
  mood: MemoryMoodEnum;
  date?: Date;
  tags?: string[];
  translations: Map<string, string>;
  autoTranslated: boolean;
  status: ContentStatusEnum;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  isDeleted?: boolean;
}

const memorySchema: Schema<IMemory> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
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
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

memorySchema.pre('validate', async function (next) {
  if (!this.isModified('title') && !this.isNew) return next();

  const normalizedTitle = removeVietnameseTones(this.title);
  const baseSlug = slugify(normalizedTitle, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  while (await Memory.exists({ slug })) {
    slug = `${baseSlug}-${count++}`;
  }

  this.slug = slug;
  next();
});

const Memory = mongoose.model<IMemory>('Memory', memorySchema, 'memories');

export default Memory;
