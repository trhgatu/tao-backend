// src/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
  PENDING = 'pending',
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  status: UserStatus;
  fullName: string;
  username: string;
  phone?: string;
  avatarUrl?: string;
  address?: string;
  gender: 'male' | 'female' | 'other';
  birthDate?: Date;
  roleId?: mongoose.Types.ObjectId;
  emailVerified: boolean;
  lastLoginAt?: Date;

  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },

    fullName: { type: String, default: '' },
    username: { type: String, default: '' },
    phone: { type: String },
    avatarUrl: { type: String },
    address: { type: String },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'other',
    },
    birthDate: { type: Date },

    roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', index: true },

    emailVerified: { type: Boolean, default: false },
    lastLoginAt: { type: Date },

    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

userSchema.virtual('role', {
  ref: 'Role',
  localField: 'roleId',
  foreignField: '_id',
  justOne: true,
});

userSchema.pre('save', function (next) {
  if (this.isModified('email') && this.email) {
    this.email = this.email.toLowerCase().trim();
  }
  if (this.isModified('isDeleted') && this.isDeleted && !this.deletedAt) {
    this.deletedAt = new Date();
  }
  next();
});

const User = mongoose.model<IUser>('User', userSchema, 'users');
export default User;
