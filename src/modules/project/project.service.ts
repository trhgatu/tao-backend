import Project, { IProject } from './project.model';
import { getCache, setCache, deleteKeysByPattern } from '@shared/services';
import { paginate, toLocaleMap } from '@core';
import type { CreateProjectInput, UpdateProjectInput } from './dtos';
import type { PaginationParams, PaginationResult, LocaleCode } from '@core';
import { mergeLocaleMap, generateSlug } from '@core';
import { ContentStatusEnum } from '@shared/enums';

// Get all projects with caching
export const getAllProjects = async (
  { page, limit }: PaginationParams,
  filters: Record<string, unknown> = {},
  sort: Record<string, 1 | -1> = { year: -1, createdAt: -1 }
): Promise<PaginationResult<IProject>> => {
  const finalFilters = { isDeleted: false, ...filters };

  const cacheKey = `projects:list:page=${page}:limit=${limit}:filters=${JSON.stringify(finalFilters)}:sort=${JSON.stringify(sort)}`;
  const cached = await getCache<PaginationResult<IProject>>(cacheKey);
  if (cached) return cached;

  const result = await paginate(Project, { page, limit }, finalFilters, sort);
  await setCache(cacheKey, result, 60);
  return result;
};

// Get by ID (raw)
export const getProjectById = (id: string) => {
  return Project.findById(id).where({ isDeleted: false });
};

// Get by ID (localized)
export const getProjectByIdLocalized = async (
  id: string,
  lang: LocaleCode,
  allowDraft = false
) => {
  const cacheKey = `projects:id:${id}:lang=${lang}:draft=${allowDraft ? 1 : 0}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const doc = await Project.findOne({
    _id: id,
    isDeleted: false,
    ...(allowDraft ? {} : { status: ContentStatusEnum.PUBLISHED }),
  });

  if (!doc) return null;

  const payload = {
    ...doc.getLocalized(lang),
    _id: doc._id,
    slug: doc.slug,
    image: doc.image,
    tech: doc.tech,
    category: doc.category,
    projectStatus: doc.projectStatus,
    link: doc.link,
    repo: doc.repo,
    featured: doc.featured,
    year: doc.year,
    status: doc.status,
    publishedAt: doc.publishedAt,
  };

  await setCache(cacheKey, payload, 60);
  return payload;
};

// Get by slug (raw)
export const getProjectBySlug = async (slug: string) => {
  const cacheKey = `projects:slug:${slug}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const project = await Project.findOne({ slug, isDeleted: false });
  if (!project) return null;

  await setCache(cacheKey, project, 60);
  return project;
};

// Get by slug (localized)
export const getProjectBySlugLocalized = async (
  slug: string,
  lang: LocaleCode,
  allowDraft = false
) => {
  const cacheKey = `projects:slug:${slug}:lang=${lang}:draft=${allowDraft ? 1 : 0}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const doc = await Project.findOne({
    slug,
    isDeleted: false,
    ...(allowDraft ? {} : { status: ContentStatusEnum.PUBLISHED }),
  });

  if (!doc) return null;

  const payload = {
    ...doc.getLocalized(lang),
    _id: doc._id,
    slug: doc.slug,
    image: doc.image,
    tech: doc.tech,
    category: doc.category,
    projectStatus: doc.projectStatus,
    link: doc.link,
    repo: doc.repo,
    featured: doc.featured,
    year: doc.year,
    status: doc.status,
    publishedAt: doc.publishedAt,
  };

  await setCache(cacheKey, payload, 60);
  return payload;
};

// Create project
export const createProject = async (payload: CreateProjectInput) => {
  let slug = payload.slug;

  if (!slug) {
    const baseName =
      payload.i18nName?.vi.text ?? payload.i18nName?.en?.text ?? 'project';
    slug = await generateSlug(baseName, Project);
  }
  const project = await Project.create({
    ...payload,
    slug,
    i18nName: toLocaleMap(payload.i18nName),
  });
  await deleteKeysByPattern('projects:list:*');
  return project;
};

export const updateProject = async (
  id: string,
  payload: UpdateProjectInput
) => {
  const project = await Project.findById(id).where({ isDeleted: false });
  if (!project) return null;

  let nChanged = false;
  let dChanged = false;

  if (payload.i18nName) {
    nChanged = mergeLocaleMap(project.i18nName, payload.i18nName);
    if (nChanged) project.markModified('i18nName');
  }

  if (payload.i18nDescription) {
    dChanged = mergeLocaleMap(project.i18nDescription, payload.i18nDescription);
    if (dChanged) project.markModified('i18nDescription');
  }

  /* if (payload.slug !== undefined) project.slug = payload.slug; */
  if (payload.image !== undefined) project.image = payload.image;
  if (payload.tech !== undefined) project.tech = payload.tech;
  if (payload.category !== undefined) project.category = payload.category;
  if (payload.projectStatus !== undefined)
    project.projectStatus = payload.projectStatus;
  if (payload.link !== undefined) project.link = payload.link;
  if (payload.repo !== undefined) project.repo = payload.repo;
  if (payload.featured !== undefined) project.featured = payload.featured;
  if (payload.year !== undefined) project.year = payload.year;
  if (payload.status !== undefined) project.status = payload.status;
  if (payload.publishedAt !== undefined)
    project.publishedAt = payload.publishedAt;

  await project.save();

  await deleteKeysByPattern('projects:list:*');
  await deleteKeysByPattern('projects:slug:*');
  return project;
};

// Soft delete
export const softDeleteProject = async (id: string) => {
  const project = await Project.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (project) {
    await deleteKeysByPattern('projects:list:*');
    await deleteKeysByPattern('projects:slug:*');
  }
  return project;
};

// Restore
export const restoreProject = async (id: string) => {
  const project = await Project.findByIdAndUpdate(
    id,
    { isDeleted: false },
    { new: true }
  );
  if (project) {
    await deleteKeysByPattern('projects:list:*');
    await deleteKeysByPattern('projects:slug:*');
  }
  return project;
};

// Hard delete
export const hardDeleteProject = async (id: string) => {
  const project = await Project.findByIdAndDelete(id);
  await deleteKeysByPattern('projects:list:*');
  await deleteKeysByPattern('projects:slug:*');
  return project;
};
