import { Request } from 'express'

export interface CommonQuery {
  filters: Record<string, unknown>
  sort: Record<string, 1 | -1>
  keyword?: string
}

export const buildCommonQuery = (
  req: Request,
  searchableFields: string[] = ['fullName', 'email']
): CommonQuery => {
  const filters: Record<string, unknown> = {}

  const isDeleted = req.query.isDeleted
  if (typeof isDeleted === 'string') {
    filters.isDeleted = isDeleted === 'true'
  } else {
    filters.isDeleted = false
  }

  const status = req.query.status
  if (typeof status === 'string') {
    filters.status = status
  }

  const keyword = (req.query.search as string) || ''
  if (keyword && searchableFields.length) {
    filters.$or = searchableFields.map((field) => ({
      [field]: { $regex: keyword, $options: 'i' },
    }))
  }

  const sortBy = (req.query.sortBy as string) || 'createdAt'
  const order = req.query.order === 'asc' ? 1 : -1
  const sort: Record<string, 1 | -1> = { [sortBy]: order }

  return { filters, sort, keyword }
}