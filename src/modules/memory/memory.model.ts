import mongoose, { Schema, Document } from 'mongoose';
import slugify from 'slugify';

export interface IMemory extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  location?: string;
  date?: Date;
  tags?: string[];
  translations: Map<string, string>;
  autoTranslated: boolean;
  status: 'private' | 'public' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean;
}

const memorySchema: Schema<IMemory> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    slug: { type: String, unique: true },
    imageUrl: { type: String },
    location: { type: String },
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
      enum: ['private', 'public', 'archived'],
      default: 'private',
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

memorySchema.pre('validate', async function (next) {
  if (!this.isModified('name') && !this.isNew) return next();

  const baseSlug = slugify(this.title, { lower: true, strict: true });
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
