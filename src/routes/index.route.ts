// src/routes/index.route.ts
import { Router } from 'express';

//auth route
import authRoutes from '@modules/auth/auth.route';

//user route
import userRoutes from '@modules/user/user.route';

//role route
import roleRoutes from '@modules/role/role.route';

//permission route
import permissionRoutes from '@modules/permission/permission.route';

import publicBlogRoutes from '@modules/blog/routes/blog.public.route';
import adminBlogRoutes from '@modules/blog/routes/blog.admin.route';

import publicMemoryRoutes from '@modules/memory/routes/memory.public.route';
import adminMemoryRoutes from '@modules/memory/routes/memory.admin.route';

import journalRoutes from '@modules/journal/journal.route';

import publicQuoteRoutes from '@modules/quote/routes/quote.public.route';
import adminQuoteRoutes from '@modules/quote/routes/quote.admin.route';

import publicProjectRoutes from '@modules/project/routes/project.public.route';
import adminProjectRoutes from '@modules/project/routes/project.admin.route';

//upload route
import uploadRoutes from '@modules/upload/upload.route';
const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);
router.use('/uploads', uploadRoutes);
// blog route

router.use('/blogs', publicBlogRoutes);
router.use('/admin/blogs', adminBlogRoutes);

router.use('/memories', publicMemoryRoutes);
router.use('/admin/memories', adminMemoryRoutes);

router.use('/journals', journalRoutes);

router.use('/quotes', publicQuoteRoutes);
router.use('/admin/quotes', adminQuoteRoutes);

router.use('/projects', publicProjectRoutes);
router.use('/admin/projects', adminProjectRoutes);

export default router;
