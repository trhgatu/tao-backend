import Role, { IRole } from '@modules/role/role.model'
import { paginate } from '@common'
import { CreateRoleInput, UpdateRoleInput } from './dtos'
import type { PaginationParams, PaginationResult } from '@common'
import { getCache, setCache, deleteKeysByPattern } from '@shared/services'

export const getAllRoles = async (
  { page, limit }: PaginationParams,
  filters: Record<string, unknown> = {},
  sort: Record<string, 1 | -1> = {}
): Promise<PaginationResult<IRole>> => {
  const finalFilters = {
    isDeleted: false,
    ...filters
  }

  const cacheKey = `roles:page=${page}:limit=${limit}:filters=${JSON.stringify(finalFilters)}:sort=${JSON.stringify(sort)}`
  const cached = await getCache<PaginationResult<IRole>>(cacheKey)
  if (cached) return cached

  const result = await paginate(
    Role,
    { page, limit },
    finalFilters,
    sort,
    [{ path: 'permissions', select: 'name' }],
  )

  await setCache(cacheKey, result)
  return result
}

export const getRoleById = (id: string) => {
  return Role.findById(id)
}

export const createRole = async (payload: CreateRoleInput) => {
  const role = await Role.create(payload)
  // Clear cache for roles after creation
  await deleteKeysByPattern('roles:*')
  return role;
}

export const updateRole = async (id: string, payload: UpdateRoleInput) => {
  const role = Role.findByIdAndUpdate(id, payload, { new: true })
  // Clear cache for roles after update
  await deleteKeysByPattern('roles:*')
  return role
}

export const deleteRole = async (id: string) => {
  const role = Role.findByIdAndDelete(id)
  await deleteKeysByPattern('roles:*')
  return role
}
