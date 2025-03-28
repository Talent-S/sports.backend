import { Feature, Plan, PlanFeature, PrismaClient } from '@prisma/client';
import {
  FeaturePayload,
  PlanFeaturePayload,
  PlanFeaturePopulated,
  PlanPayload,
  PlanRepoInterface,
} from '../interfaces/plan.interface';
export class PlanRepository implements PlanRepoInterface {
  private _prisma: PrismaClient;
  constructor() {
    this._prisma = new PrismaClient();
  }
  async create(data: PlanPayload): Promise<Plan> {
    return await this._prisma.plan.create({ data });
  }
  async update(id: string, data: Partial<PlanPayload>): Promise<Plan> {
    return await this._prisma.plan.update({ where: { id }, data });
  }
  async delete(id: string): Promise<Plan> {
    return await this._prisma.plan.delete({ where: { id } });
  }
  async plans(): Promise<Plan[]> {
    return await this._prisma.plan.findMany();
  }
  async planById(id: string): Promise<Plan | null> {
    return await this._prisma.plan.findUnique({ where: { id } });
  }
  async planByName(name: string): Promise<Plan | null> {
    return await this._prisma.plan.findUnique({ where: { name } });
  }

  async planFeatureById(id: string): Promise<PlanFeature | null> {
    return await this._prisma.planFeature.findUnique({
      where: {
        id,
      },
    });
  }

  async addPlanFeature(
    data: PlanFeaturePayload
  ): Promise<PlanFeaturePopulated> {
    return await this._prisma.planFeature.create({
      data,
      include: { plan: true, feature: true },
    });
  }
  async deletePlanFeature(id: string): Promise<PlanFeature> {
    return await this._prisma.planFeature.delete({
      where: {
        id,
      },
      include: {
        plan: true,
        feature: true,
      },
    });
  }
  async updatePlanFeature(
    id: string,
    data: Partial<PlanFeaturePayload>
  ): Promise<PlanFeature> {
    const { value } = data;
    return await this._prisma.planFeature.update({
      where: { id },
      data: { value },
      include: { plan: true, feature: true },
    });
  }
  async planFeatures(planId: string): Promise<PlanFeature[] | null> {
    return await this._prisma.planFeature.findMany({
      where: {
        planId,
      },
      include: {
        feature: true,
      },
    });
  }
  async featureByName(name: string): Promise<Feature | null> {
    return await this._prisma.feature.findUnique({
      where: {
        name,
      },
    });
  }
  async featureById(id: string): Promise<Feature | null> {
    return await this._prisma.feature.findUnique({ where: { id } });
  }
  async addFeature(data: FeaturePayload): Promise<Feature> {
    return await this._prisma.feature.create({ data });
  }
  async updateFeature(
    id: string,
    data: Partial<FeaturePayload>
  ): Promise<Feature> {
    return await this._prisma.feature.update({ where: { id }, data });
  }
  async deleteFeature(id: string): Promise<Feature> {
    return await this._prisma.feature.delete({ where: { id } });
  }
  async features(): Promise<Feature[]> {
    return await this._prisma.feature.findMany();
  }
}
