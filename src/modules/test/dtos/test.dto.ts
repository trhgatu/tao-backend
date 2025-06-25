export interface CreateTestInput {
  name: string;
  description?: string;
}

export interface UpdateTestInput {
  name?: string;
  description?: string;
  isActive?: boolean;
}
