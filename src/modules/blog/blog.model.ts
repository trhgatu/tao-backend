// src/modules/blog/blog.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import slugify from 'slugify';

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
  status: 'draft' | 'published' | 'archived';
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
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

blogSchema.pre('validate', async function (next) {
  if (!this.isModified('name') && !this.isNew) return next();

  const baseSlug = slugify(this.title, { lower: true, strict: true });
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
