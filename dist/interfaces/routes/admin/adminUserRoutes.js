"use strict";
// backend/src/interfaces/routes/profileRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import { viewProfile, editProfile } from '../controllers/profileController';
const adminController_1 = require("../../controllers/admin/adminController");
const router = (0, express_1.Router)();
router.get('/getUsers', adminController_1.getUsers);
router.put('/block/:id', adminController_1.blockUser);
router.put('/unblock/:id', adminController_1.unblockUser);
exports.default = router;
