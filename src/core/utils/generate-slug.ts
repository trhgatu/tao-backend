import { Model, Document, FilterQuery } from 'mongoose';
import slugify from 'slugify';

export const generateSlug = async <T extends Document>(
  baseName: string,
  model: Model<T>,
  field: string = 'slug'
): Promise<string> => {
  if (!baseName) throw new Error('Base name is required to generate slug');

  const baseSlug = slugify(baseName, {
    lower: true,
    strict: true,
    locale: 'vi',
  });

  let slug = baseSlug;
  let counter = 1;

  while (await model.exists({ [field]: slug } as FilterQuery<T>)) {
    slug = `${baseSlug}-${counter++}`;
  }

  return slug;
};
