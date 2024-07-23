    // backend/src/interfaces/routes/profileRoutes.ts

import { Router } from 'express';
import { viewProfile, editProfile ,changePassword} from '../controllers/profileController';

const router = Router();

router.get('/', viewProfile);
router.put('/', editProfile);
router.post('/change-password', changePassword);

export default router;
