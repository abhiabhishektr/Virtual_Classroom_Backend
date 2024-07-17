    // backend/src/interfaces/routes/profileRoutes.ts

    import { Router } from 'express';
    // import { viewProfile, editProfile } from '../controllers/profileController';
    import { getUsers, blockUser, unblockUser } from '../../controllers/admin/adminController';
    
    const router = Router();
    
    router.get('/getUsers',getUsers );
    router.put('/block/:id', blockUser);
    router.put('/unblock/:id', unblockUser);
    
    export default router;
    