import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const ACCESS_TOKEN_EXPIRES_IN = '10m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

export type RoleCode = 'admin' | 'editor' | 'viewer' | string;

export interface AccessTokenPayload {
  _id: string;
  roleId?: string;
  roleCode?: RoleCode;
  isAdmin?: boolean;
  status: string;
  email: string;
  fullName: string;
  username: string;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
  sub?: string;
  jti?: string;
}

export interface RefreshTokenPayload {
  _id: string;
  iat?: number;
  exp?: number;
}

export const generateAccessToken = (payload: AccessTokenPayload) => {
  return jwt.sign(
    {
      _id: payload._id.toString(),
      roleId: payload.roleId?.toString(),
      status: payload.status,
      email: payload.email,
      fullName: payload.fullName,
      username: payload.username,
      isAdmin: payload.isAdmin,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );
};

export const generateRefreshToken = (payload: RefreshTokenPayload) => {
  return jwt.sign(
    {
      _id: payload._id.toString(),
    },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    }
  );
};

export const verifyAccessToken = (token: string): AccessTokenPayload =>
  jwt.verify(token, ACCESS_TOKEN_SECRET) as AccessTokenPayload;

export const verifyRefreshToken = (token: string): RefreshTokenPayload =>
  jwt.verify(token, REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
