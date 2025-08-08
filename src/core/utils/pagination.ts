// src/core/utils/pagination.ts
import { Model, PopulateOptions, FilterQuery } from 'mongoose';

type Sort = Record<string, 1 | -1>;
type Select = string | Record<string, 0 | 1>;

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export const paginate = async <T>(
  model: Model<T>,
  { page = 1, limit = 10 }: PaginationParams,
  query: FilterQuery<T> = {},
  sort: Sort = {},
  populate?: string | (string | PopulateOptions)[],
  select?: Select
): Promise<PaginationResult<T>> => {
  const skip = (page - 1) * limit;

  let dbQuery = model.find(query).sort(sort).skip(skip).limit(limit);
  if (select) dbQuery = dbQuery.select(select);

  if (populate) {
    if (Array.isArray(populate)) {
      for (const p of populate) {
        if (typeof p === 'string') {
          dbQuery = dbQuery.populate(p);
        } else {
          dbQuery = dbQuery.populate(p);
        }
      }
    } else {
      dbQuery = dbQuery.populate(populate);
    }
  }

  const [data, total] = await Promise.all([
    dbQuery.lean<T[]>(),
    model.countDocuments(query),
  ]);

  return {
    data,
    total,
    currentPage: page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
};
