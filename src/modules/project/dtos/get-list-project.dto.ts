export interface ProjectListItemDto {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  tech: string[];
  category?: string;
  status: string;
  link?: string;
  repo?: string;
  featured?: boolean;
  year?: number;
}
