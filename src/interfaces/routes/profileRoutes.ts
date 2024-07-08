// backend/src/interfaces/routes/profileRoutes.ts

import { Router } from 'express';
import { viewProfile, editProfile } from '../controllers/profileController';

const router = Router();

router.get('/', viewProfile);
router.put('/', editProfile);

export default router;
