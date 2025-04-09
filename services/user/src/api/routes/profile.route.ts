import express from 'express';
import { profileController } from '../controllers/profile.controller';
import {
  authorizePermissions,
  authorizeRole,
  userAuthorizer,
} from '../middlewares/auth.middleware';
import { PERMISSIONS } from '../../config/permissions';
const router = express.Router();
router.post('/profile', profileController.createProfile);
router.patch('/profile', userAuthorizer, profileController.updateProfile);
router.get('/profile/:username', userAuthorizer, profileController.getProfile);
router.get(
  '/profile/expert/:expertId/services',
  userAuthorizer,
  profileController.expertServices
);
router.get(
  '/services',
  userAuthorizer,
  authorizeRole(['admin', 'expert']),
  profileController.getServices
);
// The service id refers to the Platform's service id
router.post(
  '/profile/service/:serviceId',
  userAuthorizer,
  authorizePermissions([PERMISSIONS.ADD_EXP_SERVICE]),
  profileController.addExpService
);
// The service id refers to the Expert's service id
router.delete(
  '/profile/service/:serviceId',
  userAuthorizer,
  authorizePermissions([PERMISSIONS.DELETE_EXP_SERVICE]),
  profileController.deleteExpService
);
// The service id refers to the Expert's service id
router.patch(
  '/profile/service/:serviceId',
  userAuthorizer,
  authorizePermissions([PERMISSIONS.UPDATE_EXP_SERVICE]),
  profileController.updateExpService
);

export default router;
