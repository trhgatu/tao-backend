// src/modules/blog/blog.model.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import slugify from 'slugify';
import { ContentStatusEnum } from '@shared/enums';
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

export interface IBlog extends Document {
  _id: mongoose.Types.ObjectId;

  i18nTitle: Map<LocaleCode, LocaleText>;
  i18nContent: Map<LocaleCode, LocaleText>;

  slug: string;
  tags: string[];
  coverImage?: string;
  publishedAt?: Date;
  status: ContentStatusEnum;
  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean;

  getLocalized(lang?: LocaleCode): { title: string; content: string };
}

type BlogModelType = Model<IBlog>;

const blogSchema = new Schema<IBlog, BlogModelType>(
  {
    i18nTitle: {
      type: Map,
      of: LocaleTextSchema,
      default: {},
    },
    i18nContent: {
      type: Map,
      of: LocaleTextSchema,
      default: {},
    },
    slug: { type: String, unique: true },
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
  { timestamps: true }
);

// Method: lấy title/content theo lang, fallback 'vi'
blogSchema.methods.getLocalized = function (lang: LocaleCode = 'vi') {
  return {
    title: pickLocale(this.i18nTitle, lang),
    content: pickLocale(this.i18nContent, lang),
  };
};

// Hook tạo slug từ title (ưu tiên 'vi', fallback 'en')
blogSchema.pre<IBlog>('validate', async function (next) {
  if (!this.isNew && !this.isModified('i18nTitle')) return next();

  const baseTitle =
    this.i18nTitle.get('vi')?.text || this.i18nTitle.get('en')?.text || 'blog';

  const normalizedTitle = removeVietnameseTones(baseTitle);
  const baseSlug =
    slugify(normalizedTitle || 'blog', { lower: true, strict: true }) || 'blog';

  let slug = baseSlug;
  let count = 1;

  const BlogModel = this.constructor as BlogModelType;
  while (await BlogModel.exists({ slug })) {
    slug = `${baseSlug}-${count++}`;
  }

  this.slug = slug;
  next();
});

const Blog = mongoose.model<IBlog, BlogModelType>('Blog', blogSchema, 'blogs');
export default Blog;
