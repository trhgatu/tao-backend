export interface BlogListItemDto {
  _id: string;
  slug: string;
  title: string;
  content: string;
  tags: string[];
  coverImage?: string;
  publishedAt?: Date;
  status: string;
}
