// src/modules/blog/blog.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import slugify from 'slugify';
import { ContentStatusEnum } from '@shared/enums';
import { removeVietnameseTones } from '@common';

export interface IBlog extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  rawContent: string;
  translations: Map<string, string>;
  autoTranslated: boolean;
  tags: string[];
  coverImage?: string;
  publishedAt?: Date;
  status: ContentStatusEnum;
  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean;
}

const blogSchema: Schema<IBlog> = new Schema(
  {
    title: { type: String, trim: true },
    slug: { type: String, unique: true },
    rawContent: { type: String },
    translations: {
      type: Map,
      of: String,
      default: {},
    },
    autoTranslated: { type: Boolean, default: false },
    tags: [{ type: String }],
    coverImage: { type: String },
    publishedAt: { type: Date },
    status: {
      type: String,
      enum: Object.values(ContentStatusEnum),
      default: ContentStatusEnum.DRAFT,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

blogSchema.pre('validate', async function (next) {
  if (!this.isModified('title') && !this.isNew) return next();

  const normalizedTitle = removeVietnameseTones(this.title);
  const baseSlug = slugify(normalizedTitle, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  while (await Blog.exists({ slug })) {
    slug = `${baseSlug}-${count++}`;
  }

  this.slug = slug;
  next();
});

const Blog = mongoose.model<IBlog>('Blog', blogSchema, 'blogs');

export default Blog;
