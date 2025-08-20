import { ContentStatusEnum, MemoryMoodEnum } from '@shared/enums';

export interface MemoryListItemDto {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  location?: string;
  mood: MemoryMoodEnum;
  date?: Date;
  tags?: string[];
  status: ContentStatusEnum;
  slug: string;
  featured?: boolean;
}
