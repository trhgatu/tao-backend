import { UserStatus } from './user.model'

export interface UserPayload {
  _id: string,
  email: string
  fullName: string
  username: string
  roleId?: string;
  status: UserStatus
}
