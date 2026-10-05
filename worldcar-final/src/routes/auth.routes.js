import { Router } from 'express';
import {
  loginController,
  loginViewController,
  registerController
} from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.get('/login', loginViewController);
authRouter.post('/login', loginController);
authRouter.post('/register', registerController);

export default authRouter;
