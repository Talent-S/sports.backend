import { Feature, Plan, PlanFeature } from '@prisma/client';

enum Role {
  USER = 'user',
  ADMIN = 'admin',
  ARTIST = 'artist',
  EXPERT = 'expert',
  SPONSER = 'sponser',
}
// Global
interface AuthUserPayload {
  id: string;
  email: string;
  role: Role;
  permissions: string[];
}
declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
    }
  }
}
export type PlanPayload = Pick<
  Plan,
  | 'name'
  | 'price'
  | 'description'
  | 'stripeProductId'
  | 'stripePriceId'
  | 'interval'
>;
export type PlanFeaturePayload = Pick<
  PlanFeature,
  'planId' | 'value' | 'featureId'
>;
export type FeaturePayload = Pick<Feature, 'name' | 'description'>;
export type PlanFeaturePopulated = PlanFeature & {
  feature?: Feature;
  plan?: Plan;
};
export interface PlanRepoInterface {
  create(data: PlanPayload): Promise<Plan>;
  update(id: string, data: Partial<PlanPayload>): Promise<Plan>;
  delete(id: string): Promise<Plan>;
  plans(): Promise<Plan[]>;
  planById(id: string): Promise<Plan | null>;
  planByName(name: string): Promise<Plan | null>;
  planFeatureById(id: string): Promise<PlanFeature | null>;
  addPlanFeature(data: PlanFeaturePayload): Promise<PlanFeaturePopulated>;
  deletePlanFeature(id: string): Promise<PlanFeature>;
  updatePlanFeature(
    id: string,
    data: Partial<PlanFeaturePayload>
  ): Promise<PlanFeaturePopulated>;
  planFeatures(id: string): Promise<PlanFeature[] | null>;

  featureByName(name: string): Promise<Feature | null>;
  featureById(id: string): Promise<Feature | null>;
  addFeature(data: FeaturePayload): Promise<Feature>;
  updateFeature(id: string, data: Partial<FeaturePayload>): Promise<Feature>;
  deleteFeature(id: string): Promise<Feature>;
  features(): Promise<Feature[]>;
}
