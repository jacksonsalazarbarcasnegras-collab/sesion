import express from 'express';

import { currentUser, login, register } from '../controllers/authentication.controller.js';
import { authenticate } from '../middleware/authorization.middleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', authenticate, currentUser);

export default router;