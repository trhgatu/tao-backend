import mongoose from 'mongoose'
import dotenv from 'dotenv'
import log from '@common/logger'

dotenv.config()

export const connectMongoDB = async () => {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is not defined in .env file')

  await mongoose.connect(uri)
  log.info('✅ Connected to MongoDB');
}
