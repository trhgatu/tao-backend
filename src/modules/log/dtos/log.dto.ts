export interface CreateLogInput {
  name: string;
  description?: string;
}

export interface UpdateLogInput {
  name?: string;
  description?: string;
  isActive?: boolean;
}
