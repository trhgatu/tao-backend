import { paginate } from '@common';
import { CreateMemoryInput, UpdateMemoryInput } from './dtos';
import type { PaginationParams, PaginationResult } from '@common';
import { getCache, setCache, deleteKeysByPattern } from '@shared/services';
import Memory, { IMemory } from './memory.model';

export const getAllMemories = async (
  { page, limit }: PaginationParams,
  filters: Record<string, unknown> = {},
  sort: Record<string, 1 | -1> = {}
): Promise<PaginationResult<IMemory>> => {
  const finalFilters = {
    isDeleted: false,
    ...filters,
  };

  const cacheKey = `memories:page=${page}:limit=${limit}:filters=${JSON.stringify(finalFilters)}:sort=${JSON.stringify(sort)}`;
  const cached = await getCache<PaginationResult<IMemory>>(cacheKey);
  if (cached) return cached;

  const result = await paginate(Memory, { page, limit }, finalFilters, sort);
  await setCache(cacheKey, result);
  return result;
};

export const getMemoryById = (id: string) => {
  return Memory.findById(id);
};

export const createMemory = async (payload: CreateMemoryInput) => {
  const memory = await Memory.create(payload);
  await deleteKeysByPattern('memories:*');
  return memory;
};

export const updateMemory = async (id: string, payload: UpdateMemoryInput) => {
  const memory = await Memory.findByIdAndUpdate(id, payload, { new: true });
  await deleteKeysByPattern('memories:*');
  return memory;
};

export const hardDeleteMemory = async (id: string) => {
  const memory = await Memory.findByIdAndDelete(id);
  await deleteKeysByPattern('memories:*');
  return memory;
};

export const softDeleteMemory = async (id: string) => {
  const memory = await Memory.findById(id);
  if (!memory) return null;

  memory.isDeleted = true;
  memory.deletedAt = new Date();

  await memory.save();
  await deleteKeysByPattern('memories:*');
  return memory;
};
