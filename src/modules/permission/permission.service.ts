import Permission, { IPermission } from './permission.model'
import { CreatePermissionInput, UpdatePermissionInput } from './dtos'
import { paginate, PaginationParams, PaginationResult } from '@common'
import { getCache, setCache } from '@shared/services'


export const getAllPermissions = async (
  { page, limit }: PaginationParams,
  filters: Record<string, unknown> = {},
  sort: Record<string, 1 | -1> = {}
): Promise<PaginationResult<IPermission>> => {
  const finalFilters = {
    isDeleted: false,
    ...filters
  }

  const cacheKey = `permissions:page=${page}:limit=${limit}:filters=${JSON.stringify(finalFilters)}:sort=${JSON.stringify(sort)}`
  const cached = await getCache<PaginationResult<IPermission>>(cacheKey)
  if (cached) return cached

  const result = await paginate(
    Permission,
    { page, limit },
    finalFilters,
    sort,
  )

  await setCache(cacheKey, result)
  return result
}

export const getPermissionById = async (id: string) => {
  return Permission.findById(id)
}

export const createPermission = async (payload: CreatePermissionInput) => {
  return Permission.create(payload)
}

export const updatePermission = async (id: string, payload: UpdatePermissionInput) => {
  return Permission.findByIdAndUpdate(id, payload, { new: true })
}

export const deletePermission = async (id: string) => {
  return Permission.findByIdAndDelete(id)
}
