import { Request, Response, NextFunction } from 'express';
import {
  featureSchema,
  planFeatureSchema,
  planSchema,
} from '../../dtos/plan.dto';
import { PlanService } from '../../services/plan.service';
import { PlanRepository } from '../../repositories/plan.repository';
const planService = new PlanService(new PlanRepository());
const createPlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const planData = planSchema.parse(req.body);
    const plan = await planService.createPlan(planData);
    res.status(201).json({ plan });
  } catch (error) {
    return next(error);
  }
};
const updatePlan = async (req: Request, res: Response, next: NextFunction) => {
  const { planId } = req.params;
  if (!planId) {
    res.status(400).json({ error: 'Missing Plan Id' });
    return;
  }
  try {
    const planData = planSchema.partial().parse(req.body);
    const plan = await planService.updatePlan(planId, planData);
    res.status(200).json({ plan });
  } catch (error) {
    return next(error);
  }
};
const deletePlan = async (req: Request, res: Response, next: NextFunction) => {
  const { planId } = req.params;
  if (!planId) {
    res.status(400).json({ error: 'Missing Plan Id' });
    return;
  }
  try {
    const plan = await planService.deletePlan(planId);
    res.status(200).json({ plan });
  } catch (error) {
    return next(error);
  }
};

const createPlanFeature = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { planId } = req.params;
  try {
    const data = planFeatureSchema.parse({ ...req.body, planId });
    const planFeature = await planService.addPlanFeatures(data);
    res.status(200).json({ planFeature });
  } catch (error) {
    return next(error);
  }
};
const updatePlanFeature = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { featureId } = req.params;
  if (!featureId) {
    res.status(400).json({ error: 'Missing Plan Feature Id in params' });
    return;
  }
  try {
    const data = planFeatureSchema.partial().parse(req.body);
    const planFeature = await planService.updatePlanFeatures(featureId, data);
    res.status(200).json({ planFeature });
  } catch (error) {
    return next(error);
  }
};
const deletePlanFeature = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { featureId } = req.params;
  if (!featureId) {
    res.status(400).json({ error: 'Missing Plan Feature Id in params' });
    return;
  }
  try {
    const planFeature = await planService.deletePlanFeature(featureId);
    res.status(200).json({ planFeature });
  } catch (error) {
    return next(error);
  }
};
const planFeatures = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { planId } = req.params;
  if (!planId) {
    res.status(400).json({ error: 'Missing Plan Id in params' });
    return;
  }
  try {
    const features = await planService.planfeatures(planId);
    res.status(200).json({ features });
  } catch (error) {
    return next(error);
  }
};

const addFeature = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = featureSchema.parse(req.body);

    const feature = await planService.addFeature(data);
    res.status(200).json({ feature });
  } catch (error) {
    return next(error);
  }
};
const updateFeature = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { featureId } = req.params;
  if (!featureId) {
    res.status(400).json({ error: 'Missing feature id' });
    return;
  }
  try {
    const data = featureSchema.partial().parse(req.body);
    const feature = await planService.updateFeature(featureId, data);
    res.status(200).json({ feature });
  } catch (error) {
    return next(error);
  }
};
const deleteFeature = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { featureId } = req.params;
  if (!featureId) {
    res.status(400).json({ error: 'Missing feature id' });
    return;
  }
  try {
    const feature = await planService.deleteFeature(featureId);
    res.status(200).json({ feature });
  } catch (error) {
    return next(error);
  }
};
const features = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const features = await planService.features();
    res.status(200).json({ features });
  } catch (error) {
    return next(error);
  }
};
export const planControllers = {
  createPlan,
  updatePlan,
  deletePlan,
  createPlanFeature,
  updatePlanFeature,
  deletePlanFeature,
  planFeatures,
  addFeature,
  updateFeature,
  deleteFeature,
  features,
};
