export interface CreateTemplateInput {
  name: string;
  description?: string;
}

export interface UpdateTemplateInput {
  name?: string;
  description?: string;
  isActive?: boolean;
}
