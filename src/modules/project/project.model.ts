import mongoose, { Schema, Document, model, Types } from 'mongoose';
import { ContentStatusEnum, ProjectStatusEnum } from '@shared/enums';
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

export interface IProject extends Document {
  _id: mongoose.Types.ObjectId;
  slug: string;
  i18nName: Map<LocaleCode, LocaleText>;
  i18nDescription: Map<LocaleCode, LocaleText>;
  image?: string;
  tech?: string[];
  category?: string;
  projectStatus?: ProjectStatusEnum;
  link?: string;
  repo?: string;
  featured?: boolean;
  year?: number;
  status: ContentStatusEnum;
  publishedAt?: Date;
  isDeleted?: boolean;
  createdAt: Date;
  updatedAt: Date;

  getLocalized(lang?: LocaleCode): {
    name: string;
    description: string;
  };
}

const projectSchema = new Schema<IProject>(
  {
    slug: { type: String, required: true, unique: true },
    i18nName: { type: Map, of: LocaleTextSchema, default: {} },
    i18nDescription: { type: Map, of: LocaleTextSchema, default: {} },
    image: { type: String },
    tech: [{ type: String }],
    category: { type: String },
    link: { type: String },
    repo: { type: String },
    featured: { type: Boolean, default: false },
    year: { type: Number },
    status: {
      type: String,
      enum: Object.values(ContentStatusEnum),
      default: ContentStatusEnum.DRAFT,
    },
    projectStatus: {
      type: String,
      enum: Object.values(ProjectStatusEnum),
      default: ProjectStatusEnum.IN_PROGRESS,
    },
    publishedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

projectSchema.index({ isDeleted: 1, status: 1, createdAt: -1 });

projectSchema.methods.getLocalized = function (lang: LocaleCode = 'vi') {
  return {
    name: pickLocaleText(this.i18nName, lang),
    description: pickLocaleText(this.i18nDescription, lang),
  };
};

const Project = model<IProject>('Project', projectSchema, 'projects');
export default Project;
