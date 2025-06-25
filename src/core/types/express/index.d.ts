import { UserPayload } from "@modules/user/user.payload"

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload
    }
  }
}
