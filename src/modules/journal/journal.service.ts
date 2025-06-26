import { paginate } from '@common';
import { getCache, setCache, deleteKeysByPattern } from '@shared/services';
import Journal, { IJournal } from './journal.model';
import type { PaginationParams, PaginationResult } from '@common';
import type { CreateJournalInput, UpdateJournalInput } from './dtos';

export const getAllJournals = async (
  { page, limit }: PaginationParams,
  filters: Record<string, unknown> = {},
  sort: Record<string, 1 | -1> = {}
): Promise<PaginationResult<IJournal>> => {
  const finalFilters = {
    isDeleted: false,
    ...filters,
  };

  const cacheKey = `journals:page=${page}:limit=${limit}:filters=${JSON.stringify(finalFilters)}:sort=${JSON.stringify(sort)}`;
  const cached = await getCache<PaginationResult<IJournal>>(cacheKey);
  if (cached) return cached;

  const result = await paginate(Journal, { page, limit }, finalFilters, sort);

  await setCache(cacheKey, result);
  return result;
};

export const getJournalById = (id: string) => {
  return Journal.findById(id);
};

export const createJournal = async (payload: CreateJournalInput) => {
  const journal = await Journal.create(payload);
  await deleteKeysByPattern('journals:*');
  return journal;
};

export const updateJournal = async (
  id: string,
  payload: UpdateJournalInput
) => {
  const journal = await Journal.findByIdAndUpdate(id, payload, {
    new: true,
  });
  await deleteKeysByPattern('journals:*');
  return journal;
};

export const deleteJournal = async (id: string) => {
  const journal = await Journal.findByIdAndDelete(id);
  await deleteKeysByPattern('journals:*');
  return journal;
};
