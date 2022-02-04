import { Router } from 'express';
import Auth from '@middlewares/auth';
import UserController from '@controllers/UserController';

const router = Router();

router.use('/', [Auth]);

router.get('/', UserController.show);

export default router;
