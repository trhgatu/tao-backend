import { Schema, model, Document } from 'mongoose'

export interface IPermission extends Document {
  name: string
  description?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  isDeleted?: boolean
}

const permissionSchema = new Schema<IPermission>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
)

const Permission = model<IPermission>('Permission', permissionSchema, 'permissions')
export default Permission
