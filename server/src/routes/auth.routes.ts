import { Router } from 'express';
import { accounts, changePassword, login, logout, me, refresh, register, updateMe } from '../controllers/auth.controllers.ts';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', me);
router.patch('/me', updateMe);
router.post('/change-password', changePassword);
router.get('/accounts', accounts);

export default router;