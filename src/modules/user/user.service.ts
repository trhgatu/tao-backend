import User, { IUser } from '@modules/user/user.model'
import { AppError, paginate } from '@common'
import { UpdateProfileDto } from './dtos'
import type { PaginationParams, PaginationResult } from '@common'
import { getCache, setCache } from '@shared/services'

export const getMe = async (userId: string) => {
  const user = await User.findOne({ _id: userId, isDeleted: false }).select('-password')
  if (!user) throw new AppError('User not found', 404)
  return user
}

export const updateMe = async (userId: string, payload: UpdateProfileDto) => {
  const user = await User.findOneAndUpdate(
    { _id: userId, isDeleted: false },
    payload,
    { new: true }
  ).select('-password')
  if (!user) throw new AppError('User not found', 404)
  return user
}

export const getAllUsers = async (
  { page, limit }: PaginationParams,
  filters: Record<string, unknown> = {},
  sort: Record<string, 1 | -1> = {}
): Promise<PaginationResult<IUser>> => {
  const finalFilters = {
    isDeleted: false,
    ...filters
  }

  const cacheKey = `users:page=${page}:limit=${limit}:filters=${JSON.stringify(finalFilters)}:sort=${JSON.stringify(sort)}`
  const cached = await getCache<PaginationResult<IUser>>(cacheKey)
  if (cached) return cached

  const result = await paginate(
    User,
    { page, limit },
    finalFilters,
    sort,
    [{ path: 'roleId', select: 'name' }],
    '-password'
  )

  await setCache(cacheKey, result)
  return result
}