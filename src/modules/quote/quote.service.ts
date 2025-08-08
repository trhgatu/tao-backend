import { paginate } from '@core';
import { getCache, setCache, deleteKeysByPattern } from '@shared/services';
import Quote, { IQuote } from './quote.model';
import type { CreateQuoteInput, UpdateQuoteInput } from './dtos/quote.dto';
import type { PaginationParams, PaginationResult } from '@core';

export const getAllQuotes = async (
  { page, limit }: PaginationParams,
  filters: Record<string, unknown> = {},
  sort: Record<string, 1 | -1> = { createdAt: -1 }
): Promise<PaginationResult<IQuote>> => {
  const finalFilters = {
    isDeleted: false,
    ...filters,
  };

  const cacheKey = `quotes:page=${page}:limit=${limit}:filters=${JSON.stringify(
    finalFilters
  )}:sort=${JSON.stringify(sort)}`;

  const cached = await getCache<PaginationResult<IQuote>>(cacheKey);
  if (cached) return cached;

  const result = await paginate(Quote, { page, limit }, finalFilters, sort);
  await setCache(cacheKey, result);
  return result;
};

export const getQuoteById = (id: string) => {
  return Quote.findById(id);
};

export const createQuote = async (payload: CreateQuoteInput) => {
  const quote = await Quote.create(payload);
  await deleteKeysByPattern('quotes:*');
  return quote;
};

export const updateQuote = async (id: string, payload: UpdateQuoteInput) => {
  const quote = await Quote.findByIdAndUpdate(id, payload, { new: true });
  await deleteKeysByPattern('quotes:*');
  return quote;
};

export const deleteQuote = async (id: string) => {
  const quote = await Quote.findByIdAndDelete(id);
  await deleteKeysByPattern('quotes:*');
  return quote;
};
