import { ContentStatusEnum } from '@shared/enums';

export interface ProjectListItemDto {
  _id: string;
  name: string;
  slug: string;
  description: string;
  thumbnail?: string;
  images?: string[];
  tech?: {
    name: string;
  }[];
  category?: string;
  status: ContentStatusEnum;
  projectStatus?: string;
  type?: string;
  link?: string;
  repo?: string;
  featured?: boolean;
  year?: number;
}
