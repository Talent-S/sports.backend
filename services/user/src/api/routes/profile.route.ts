import express from 'express';
import { profileController } from '../controllers/profile.controller';
import { userAuthorizer } from '../middlewares/auth.middleware';
const router = express.Router();
router.post('/profile', profileController.createProfile);
router.patch('/profile', userAuthorizer, profileController.updateProfile);
router.get('/profile/:username', userAuthorizer, profileController.getProfile);

export default router;
