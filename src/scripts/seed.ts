// src/scripts/seed.ts
import 'module-alias/register'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

import Role from '@modules/role/role.model'
import User from '@modules/user/user.model'
import Permission from '@modules/permission/permission.model'

import log from '@common/logger'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  log.error('Missing MONGODB_URI in .env')
  process.exit(1)
}

const runSeed = async () => {
  await mongoose.connect(MONGODB_URI)
  log.info('Connected to MongoDB');

  // Check if admin user already exists
  const existingAdmin = await User.findOne({ email: 'admin@example.com' })
  if (existingAdmin) {
    log.info('Admin user already exists. Skipping seed.')
    return process.exit(0)
  }

  // 1. Seed permissions
  const permissions = await Permission.insertMany([
    { name: 'user:read', description: 'Read users' },
    { name: 'user:update', description: 'Update users' },
    { name: 'role:manage', description: 'Manage roles' },
  ])

  // 2. Seed admin role
  const adminRole = await Role.create({
    name: 'admin',
    description: 'Administrator',
    permissions: permissions.map((p) => p._id),
    isActive: true,
  })

  // 3. Seed admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await User.create({
    fullName: 'Super Admin',
    email: 'admin@example.com',
    password: hashedPassword,
    roleId: adminRole._id,
    status: 'active',
    emailVerified: true,
  })

  log.info('Seed completed successfully')
  process.exit(0)
}

runSeed().catch((_ ) => {
  process.exit(1)
})
