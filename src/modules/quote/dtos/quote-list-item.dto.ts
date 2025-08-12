export interface QuoteListItemDto {
  _id: string;
  text: string;
  author: string;
  tags: string[];
  publishedAt?: Date;
  status: string;
}
