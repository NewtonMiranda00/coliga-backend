import { Router } from 'express';
import Auth from '@middlewares/auth';

const router = Router();

router.use('/:id', [Auth]);

router.get('/:id', (req, res) => res.send({ user: req.params.id, auth: true }));

export default router;
