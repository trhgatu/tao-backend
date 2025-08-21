import { ContentStatusEnum } from '@shared/enums';

export interface ProjectListItemDto {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  tech?: {
    name: string;
    icon: string;
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
