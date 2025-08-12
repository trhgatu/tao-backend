import User from '@modules/user/user.model';
import Role from '@modules/role/role.model';
import bcrypt from 'bcrypt';
import {
  AccessTokenPayload,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '@core/jwt';
import { AppError } from '@core';
import { LoginInput, RegisterInput } from './dtos';

export const register = async (input: RegisterInput) => {
  const email = input.email.toLowerCase().trim();
  const existing = await User.findOne({ email, isDeleted: false });
  if (existing) throw new AppError('Email already in use', 400);

  const hashedPassword = await bcrypt.hash(input.password, 10);
  const user = await User.create({ ...input, email, password: hashedPassword });

  // resolve roleCode
  let roleCode: string | undefined;
  if (user.roleId) {
    const role = await Role.findById(user.roleId).lean();
    roleCode = role?.code;
  }

  const payload: AccessTokenPayload = {
    _id: String(user._id),
    roleId: user.roleId ? String(user.roleId) : undefined,
    roleCode,
    isAdmin: roleCode === 'admin',
    status: user.status,
    email: user.email,
    fullName: user.fullName,
    username: user.username,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken({ _id: payload._id });

  return {
    user: {
      _id: payload._id,
      fullName: payload.fullName,
      email: payload.email,
      roleId: payload.roleId,
      roleCode: payload.roleCode,
      isAdmin: payload.isAdmin,
      status: payload.status,
    },
    accessToken,
    refreshToken,
  };
};
export const login = async (input: LoginInput) => {
  const email = input.email.toLowerCase().trim();
  const user = await User.findOne({ email }).select('+password');
  if (!user || user.isDeleted) throw new AppError('Invalid credentials', 401);

  const isMatch = await bcrypt.compare(input.password, user.password);
  if (!isMatch) throw new AppError('Invalid credentials', 401);

  await User.updateOne(
    { _id: user._id },
    { $set: { lastLoginAt: new Date() } }
  );

  let roleCode: string | undefined;
  if (user.roleId) {
    const role = await Role.findById(user.roleId).lean();
    roleCode = role?.code;
  }

  const payload: AccessTokenPayload = {
    _id: String(user._id),
    roleId: user.roleId ? String(user.roleId) : undefined,
    roleCode,
    isAdmin: roleCode === 'admin',
    status: user.status,
    email: user.email,
    fullName: user.fullName,
    username: user.username,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken({ _id: payload._id });

  return {
    accessToken,
    refreshToken,
    user: {
      _id: payload._id,
      fullName: payload.fullName,
      email: payload.email,
      roleId: payload.roleId,
      isAdmin: payload.isAdmin,
      roleCode: payload.roleCode,
      status: payload.status,
    },
  };
};

export const getMe = async (userId: string) => {
  const user = await User.findById(userId).select('-password').lean();
  if (!user || user.isDeleted) throw new AppError('User not found', 404);

  return user;
};

export const refreshAccessToken = async (token: string) => {
  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw new AppError('Invalid refresh token', 401);
  }

  const user = await User.findById(payload._id);
  if (!user || user.isDeleted) throw new AppError('User not found', 401);

  let roleCode: string | undefined;
  if (user.roleId) {
    const role = await Role.findById(user.roleId).lean();
    roleCode = role?.code;
  }

  const newPayload: AccessTokenPayload = {
    _id: String(user._id),
    roleId: user.roleId ? String(user.roleId) : undefined,
    roleCode,
    isAdmin: roleCode === 'admin',
    status: user.status,
    email: user.email,
    fullName: user.fullName,
    username: user.username,
  };

  const accessToken = generateAccessToken(newPayload);
  return { accessToken };
};
