// src/modules/memory/memory.service.ts
import { paginate, toLocaleMap, mergeLocaleMap } from '@core';
import type { PaginationParams, PaginationResult, LocaleCode } from '@core';
import { getCache, setCache, deleteKeysByPattern } from '@shared/services';
import Memory, { IMemory } from './memory.model';
import type { CreateMemoryInput, UpdateMemoryInput } from './dtos';

export const getAllMemories = async (
  { page, limit }: PaginationParams,
  filters: Record<string, unknown> = {},
  sort: Record<string, 1 | -1> = {}
): Promise<PaginationResult<IMemory>> => {
  const finalFilters = { isDeleted: false, ...filters };

  const cacheKey =
    `memories:list:page=${page}:limit=${limit}` +
    `:filters=${JSON.stringify(finalFilters)}` +
    `:sort=${JSON.stringify(sort)}`;

  const cached = await getCache<PaginationResult<IMemory>>(cacheKey);
  if (cached) return cached;

  const result = await paginate(Memory, { page, limit }, finalFilters, sort);

  await setCache(cacheKey, result, 60);
  return result;
};

export const getMemoryById = (id: string) => {
  return Memory.findById(id).where({ isDeleted: false });
};

export const getMemoryBySlugLocalized = async (
  slug: string,
  lang: LocaleCode
) => {
  const cacheKey = `memories:slug:${slug}:lang:${lang}`;
  const cached = await getCache<unknown>(cacheKey);
  if (cached) return cached;

  const doc = await Memory.findOne({ slug, isDeleted: false });
  if (!doc) return null;

  const { title, description } = doc.getLocalized(lang);
  const payload = {
    slug: doc.slug,
    title,
    description,
    imageUrl: doc.imageUrl,
    location: doc.location,
    mood: doc.mood,
    date: doc.date,
    tags: doc.tags,
    status: doc.status,
    _id: doc._id,
  };

  await setCache(cacheKey, payload, 60);
  return payload;
};

export const createMemory = async (payload: CreateMemoryInput) => {
  const memory = await Memory.create({
    ...payload,
    i18nTitle: toLocaleMap(payload.i18nTitle),
    i18nDescription: toLocaleMap(payload.i18nDescription),
  });

  await deleteKeysByPattern('memories:list:*');
  return memory;
};

export const updateMemory = async (id: string, payload: UpdateMemoryInput) => {
  const doc = await Memory.findById(id).where({ isDeleted: false });
  if (!doc) return null;

  mergeLocaleMap(doc.i18nTitle, payload.i18nTitle);
  mergeLocaleMap(doc.i18nDescription, payload.i18nDescription);

  if (payload.imageUrl !== undefined) doc.imageUrl = payload.imageUrl;
  if (payload.location !== undefined) doc.location = payload.location;
  if (payload.mood !== undefined) doc.mood = payload.mood;
  if (payload.date !== undefined) doc.date = payload.date;
  if (payload.tags !== undefined) doc.tags = payload.tags;
  if (payload.status !== undefined) doc.status = payload.status;
  if (payload.publishedAt !== undefined) doc.publishedAt = payload.publishedAt;

  await doc.save();

  await deleteKeysByPattern('memories:list:*');
  await deleteKeysByPattern(`memories:slug:${doc.slug}:*`);
  return doc;
};

export const hardDeleteMemory = async (id: string) => {
  const doc = await Memory.findByIdAndDelete(id);
  if (doc) {
    await deleteKeysByPattern('memories:list:*');
    await deleteKeysByPattern(`memories:slug:${doc.slug}:*`);
  }
  return doc;
};

export const softDeleteMemory = async (id: string) => {
  const doc = await Memory.findById(id);
  if (!doc) return null;

  doc.isDeleted = true;
  doc.deletedAt = new Date();
  await doc.save();

  await deleteKeysByPattern('memories:list:*');
  await deleteKeysByPattern(`memories:slug:${doc.slug}:*`);
  return doc;
};
