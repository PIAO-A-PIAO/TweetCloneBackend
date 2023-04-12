import express from 'express';
import { signup, signin, cancelAccount } from '../controllers/auth.js';
import { verifyToken } from '../verifyToken.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.delete('/', verifyToken, cancelAccount)

export default router;