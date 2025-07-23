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
import blogRoutes from '@modules/blog/blog.route';
import memoryRoutes from '@modules/memory/memory.route';
import journalRoutes from '@modules/journal/journal.route';
import quoteRoutes from '@modules/quote/quote.route';
//upload route
import uploadRoutes from '@modules/upload/upload.route';
const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);
router.use('/uploads', uploadRoutes);
// blog route

router.use('/blogs', blogRoutes);
router.use('/memories', memoryRoutes);
router.use('/journals', journalRoutes);
router.use('/quotes', quoteRoutes);

export default router;
