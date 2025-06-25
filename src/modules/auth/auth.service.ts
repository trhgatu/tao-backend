import User from '@modules/user/user.model'
import bcrypt from 'bcrypt'
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '@common/jwt'
import { AppError } from '@common'
import { LoginInput, RegisterInput } from './dtos'

export const register = async (input: RegisterInput) => {
  const existing = await User.findOne({ email: input.email })
  if (existing) throw new AppError('Email already in use', 400)

  const hashedPassword = await bcrypt.hash(input.password, 10)
  const user = await User.create({
    ...input,
    password: hashedPassword,
  })

  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)

  return {
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      roleId: user.roleId,
      status: user.status,
    },
    accessToken,
    refreshToken,
  }
}

export const login = async (input: LoginInput) => {
  const user = await User.findOne({ email: input.email })
  if (!user || user.isDeleted)
    throw new AppError('Invalid credentials', 401)

  const isMatch = await bcrypt.compare(input.password, user.password)
  if (!isMatch) throw new AppError('Invalid credentials', 401)

  user.lastLoginAt = new Date()
  await user.save()

  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)

  const sanitizedUser = {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    roleId: user.roleId,
    status: user.status,
  }

  return {
    accessToken,
    refreshToken,
    user: sanitizedUser,
  }
}


export const getMe = async (userId: string) => {
  const user = await User.findById(userId).select('-password')
  if (!user || user.isDeleted)
    throw new AppError('User not found', 404)

  return user
}

export const refreshAccessToken = async (token: string) => {
  let payload
  try {
    payload = verifyRefreshToken(token)
  } catch {
    throw new AppError('Invalid refresh token', 401)
  }

  const user = await User.findById(payload._id)
  if (!user || user.isDeleted)
    throw new AppError('User not found', 401)

  const accessToken = generateAccessToken(user)

  return { accessToken }
}
