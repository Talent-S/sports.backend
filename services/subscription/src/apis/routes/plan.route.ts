import express from 'express';
import {
  checkPermissions,
  userAuthorizer,
} from '../middlewares/auth.middleware';
import { ListedPermissions } from '../../interfaces';
import { planControllers } from '../controllers/plan.controller';
const router = express.Router();

// Features related
router.get(
  '/features',
  userAuthorizer,
  checkPermissions([ListedPermissions.MANAGE_PLANS]),
  planControllers.features
);
router.post(
  '/features',
  userAuthorizer,
  checkPermissions([ListedPermissions.MANAGE_PLANS]),
  planControllers.addFeature
);
router.patch(
  '/features/:featureId',
  userAuthorizer,
  checkPermissions([ListedPermissions.MANAGE_PLANS]),
  planControllers.updateFeature
);
router.delete(
  '/features/:featureId',
  userAuthorizer,
  checkPermissions([ListedPermissions.MANAGE_PLANS]),
  planControllers.deleteFeature
);
// Plans related

router.post(
  '/plans',
  userAuthorizer,
  checkPermissions([ListedPermissions.MANAGE_PLANS]),
  planControllers.createPlan
);
router.patch(
  '/plans/:planId',
  userAuthorizer,
  checkPermissions([ListedPermissions.MANAGE_PLANS]),
  planControllers.updatePlan
);
router.delete(
  '/plans/:planId',
  userAuthorizer,
  checkPermissions([ListedPermissions.MANAGE_PLANS]),
  planControllers.deletePlan
);

// Plan Features related
router.get(
  '/plans/:planId/features',
  userAuthorizer,
  checkPermissions([ListedPermissions.MANAGE_PLANS]),
  planControllers.planFeatures
);
router.post(
  '/plans/:planId/features',
  userAuthorizer,
  checkPermissions([ListedPermissions.MANAGE_PLANS]),
  planControllers.createPlanFeature
);
router.patch(
  '/plan-features/:featureId',
  userAuthorizer,
  checkPermissions([ListedPermissions.MANAGE_PLANS]),
  planControllers.updatePlanFeature
);
router.delete(
  '/plan-features/:featureId',
  userAuthorizer,
  checkPermissions([ListedPermissions.MANAGE_PLANS]),
  planControllers.deletePlanFeature
);

export default router;
