export interface CreateUploadInput {
  name: string;
  description?: string;
}

export interface UpdateUploadInput {
  name?: string;
  description?: string;
  isActive?: boolean;
}
