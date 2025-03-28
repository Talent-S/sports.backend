import express from 'express';
import { AuthController } from './auth.controllers';
import { UserAuthorizer } from './auth.middleware';
const router = express.Router();
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.patch('/verify-email', AuthController.verify);
router.post('/resend-otp', AuthController.resendOtp);
router.get('/validate', AuthController.validateToken);
router.patch('/password', UserAuthorizer, AuthController.changePassword);
router.post('/forgot-password', AuthController.forgotPassword);
router.get('/reset-password/:token', AuthController.validateResetToken);
router.post('/reset-password/:token', AuthController.resetPassword);

export default router;
