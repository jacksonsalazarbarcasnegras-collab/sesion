import express from 'express';

import { authenticate, authorizeRoles } from '../middleware/authorization.middleware.js';
import {
  createUser,
  deleteUser,
  getRoles,
  getUserById,
  getUsers,
  updateUser,
} from '../controllers/user.controller.js';

const router = express.Router();

router.use(authenticate, authorizeRoles(1));

router.get('/roles', getRoles);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;