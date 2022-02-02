import { Router } from 'express';
import AuthController from '@controllers/AuthController';
import RegisterValidator from '@middlewares/registerValidator';
import ActiveAccountValid from '@middlewares/activeAccountValidator';
import ForgotPasswordValid from '@middlewares/forgotPasswordValidator';

const router = Router();

router.post('/register', [RegisterValidator], AuthController.register);

router.get('/active', [ActiveAccountValid], AuthController.activeAccount);

router.post('/authenticate', [], AuthController.authenticate);

router
  .post('/forgot_password', [ForgotPasswordValid], AuthController.forgotPassword);

router.post('/reset_password', AuthController.resetPassword);

export default router;
