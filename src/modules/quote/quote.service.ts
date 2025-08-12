// src/modules/quote/quote.service.ts
import { paginate, toLocaleMap, mergeLocaleMap } from '@core';
import { getCache, setCache, deleteKeysByPattern } from '@shared/services';
import Quote, { IQuote } from './quote.model';
import type { CreateQuoteInput, UpdateQuoteInput } from './dtos';
import type { PaginationParams, PaginationResult, LocaleCode } from '@core';
import { ContentStatusEnum } from '@shared/enums';

export const getAllQuotes = async (
  { page, limit }: PaginationParams,
  filters: Record<string, unknown> = {},
  sort: Record<string, 1 | -1> = { createdAt: -1 }
): Promise<PaginationResult<IQuote>> => {
  const finalFilters = { isDeleted: false, ...filters };

  const cacheKey = `quotes:list:page=${page}:limit=${limit}:filters=${JSON.stringify(finalFilters)}:sort=${JSON.stringify(sort)}`;
  const cached = await getCache<PaginationResult<IQuote>>(cacheKey);
  if (cached) return cached;

  const result = await paginate(
    Quote,
    { page, limit },
    finalFilters,
    sort,
    undefined,
    {
      i18nText: 1,
      i18nAuthor: 1,
      tags: 1,
      status: 1,
      publishedAt: 1,
      createdAt: 1,
    }
  );

  await setCache(cacheKey, result, 60);
  return result;
};

export const getQuoteById = (id: string) => {
  return Quote.findById(id).where({ isDeleted: false });
};

export const getQuoteByIdLocalized = async (
  id: string,
  lang: LocaleCode,
  allowDraft = false
) => {
  const cacheKey = `quotes:id:${id}:lang=${lang}:draft=${allowDraft ? 1 : 0}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const doc = await Quote.findOne({
    _id: id,
    isDeleted: false,
    ...(allowDraft ? {} : { status: ContentStatusEnum.PUBLISHED }),
  });
  if (!doc) return null;

  const payload = {
    ...doc.getLocalized(lang),
    _id: doc._id,
    tags: doc.tags,
    status: doc.status,
    publishedAt: doc.publishedAt,
  };

  await setCache(cacheKey, payload, 60);
  return payload;
};

export const getRandomQuoteLocalized = async (
  lang: LocaleCode,
  filters: Record<string, unknown> = {}
) => {
  const finalFilters = {
    isDeleted: false,
    status: ContentStatusEnum.PUBLISHED,
    ...filters,
  };
  const cacheKey = `quotes:random:lang=${lang}:filters=${JSON.stringify(finalFilters)}`;

  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const [doc] = await Quote.aggregate([
    { $match: finalFilters },
    { $sample: { size: 1 } },
    { $limit: 1 },
  ]);

  if (!doc) return null;

  const hydrated = Quote.hydrate(doc);
  const payload = {
    ...hydrated.getLocalized(lang),
    _id: hydrated._id,
    tags: hydrated.tags,
    status: hydrated.status,
  };

  await setCache(cacheKey, payload, 60);
  return payload;
};

export const createQuote = async (payload: CreateQuoteInput) => {
  const quote = await Quote.create({
    i18nText: toLocaleMap(payload.i18nText),
    i18nAuthor: payload.i18nAuthor
      ? toLocaleMap(payload.i18nAuthor)
      : undefined,
    tags: payload.tags ?? [],
    status: payload.status,
    publishedAt: payload.publishedAt,
  });

  await deleteKeysByPattern('quotes:list:*');
  await deleteKeysByPattern('quotes:random:*');
  return quote;
};

export const updateQuote = async (id: string, payload: UpdateQuoteInput) => {
  const doc = await Quote.findById(id).where({ isDeleted: false });
  if (!doc) return null;

  const tChanged = mergeLocaleMap(doc.i18nText, payload.i18nText);
  if (tChanged) doc.markModified('i18nText');

  let aChanged = false;
  if (payload.i18nAuthor) {
    if (!doc.i18nAuthor) doc.i18nAuthor = new Map();
    aChanged = mergeLocaleMap(doc.i18nAuthor, payload.i18nAuthor);
    if (aChanged) doc.markModified('i18nAuthor');
  }

  if (payload.tags !== undefined) doc.tags = payload.tags;
  if (payload.status !== undefined) doc.status = payload.status;
  if (payload.publishedAt !== undefined) doc.publishedAt = payload.publishedAt;

  await doc.save();

  await deleteKeysByPattern('quotes:list:*');
  await deleteKeysByPattern('quotes:random:*');
  return doc;
};

export const hardDeleteQuote = async (id: string) => {
  const doc = await Quote.findByIdAndDelete(id);
  await deleteKeysByPattern('quotes:list:*');
  await deleteKeysByPattern('quotes:random:*');
  return doc;
};

export const softDeleteQuote = async (id: string) => {
  const doc = await Quote.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (doc) {
    await deleteKeysByPattern('quotes:list:*');
    await deleteKeysByPattern('quotes:random:*');
  }
  return doc;
};

export const restoreQuote = async (id: string) => {
  const doc = await Quote.findByIdAndUpdate(
    id,
    { isDeleted: false },
    { new: true }
  );
  if (doc) {
    await deleteKeysByPattern('quotes:list:*');
    await deleteKeysByPattern('quotes:random:*');
  }
  return doc;
};
