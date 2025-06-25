import { Router } from 'express';
import * as controller from './auth.controller';
import { requireAuth, validate } from '@middlewares';
import { LoginSchema, RegisterSchema } from './dtos'

const router = Router();

router.post('/login', validate(LoginSchema), controller.login);
router.post('/register', validate(RegisterSchema), controller.register);
router.post('/refresh-token', controller.refreshToken);
router.get('/me', requireAuth, controller.getMe);
router.post('/logout', controller.logout);

export default router;
