import express from 'express'
import { uploadImage } from './upload.controller'
import { uploadMiddleware } from '@middlewares'

const router = express.Router()

router.post('/upload-image', uploadMiddleware.single('image'), uploadImage)

export default router
