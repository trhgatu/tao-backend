import mongoose from 'mongoose'
import { Schema, Types } from 'mongoose'

export interface IAuditLog {
  userId?: Types.ObjectId
  action?: string
  targetModel?: string
  targetId?: Types.ObjectId | string,
  description?: string,
  method: string
  path: string
  statusCode: number
  duration: number
  metadata: {
    body?: Record<string, unknown>
    query?: Record<string, unknown>
    params?: Record<string, unknown>
    ip?: string
  }
  createdAt: Date
}

const auditLogSchema: Schema<IAuditLog> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    action: { type: String },
    targetModel: { type: String },
    targetId: { type: Schema.Types.Mixed },
    description: { type: String },
    method: String,
    path: String,
    statusCode: Number,
    duration: Number,
    metadata: Object,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema, 'audit_logs');

export default AuditLog