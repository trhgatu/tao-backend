export interface CreateBlogInput {
  name: string;
  description?: string;
}

export interface UpdateBlogInput {
  name?: string;
  description?: string;
  isActive?: boolean;
}
