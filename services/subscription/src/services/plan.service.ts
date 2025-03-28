import Stripe from 'stripe';
import { stripe } from '../config/stripe.config';
import {
  FeaturePayload,
  PlanFeaturePayload,
  PlanPayload,
  PlanRepoInterface,
} from '../interfaces/plan.interface';
import {
  APIError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../utils/error';

export class PlanService {
  private _repo: PlanRepoInterface;
  constructor(repo: PlanRepoInterface) {
    this._repo = repo;
  }
  async createPlan(
    data: Omit<PlanPayload, 'stripePriceId' | 'stripeProductId'>
  ) {
    const { name, description, interval } = data;
    const planExist = await this._repo.planByName(name);
    if (planExist)
      throw new ConflictError('Plan with similar name already exist');
    let product: Stripe.Product, price: Stripe.Price;
    try {
      // Creating a Stripe Product
      product = await stripe.products.create({
        name,
        description: description ? description : undefined,
      });
      // Creating a Stripe Price, then attach the above product to the price
      if (interval === 'one_time') {
        price = await stripe.prices.create({
          unit_amount: Math.round(data.price * 100),
          currency: 'usd',
          product: product.id,
        });
      } else {
        price = await stripe.prices.create({
          unit_amount: Math.round(data.price * 100),
          currency: 'usd',
          recurring: { interval },
          product: product.id,
        });
      }
      if (!price || !product) {
        throw new APIError('Internal Error');
      }
      return await this._repo.create({
        ...data,
        stripePriceId: price.id,
        stripeProductId: product.id,
      });
    } catch (error) {
      if (product!) {
        await stripe.products.del(product.id);
      }
      if (price!) {
        await stripe.prices.update(price.id, { active: false });
      }
      throw new APIError('Failed to create a plan');
    }
  }
  async updatePlan(id: string, data: Partial<PlanPayload>) {
    if (!id) throw new ValidationError('Missing plan id');
    const planExist = await this._repo.planById(id);
    if (!planExist) throw new NotFoundError('Plan not found');
    if (data.name || data.description) {
      await stripe.products.update(planExist.stripeProductId, {
        name: data.name || planExist.name,
        description: data.description || planExist.description,
      });
    }

    if (data.price && data.interval) {
      if (data.interval && data.interval !== 'one_time') {
        await stripe.prices.update(planExist.stripePriceId, {
          active: false,
        });
        const price = await stripe.prices.create({
          unit_amount: Math.round(data.price * 100), // Stripe expects the amount in cents
          currency: 'usd',
          recurring: { interval: data.interval },
          product: planExist.stripeProductId,
        });
        data.stripePriceId = price.id;
      }
      // Handle Else case
    }
    if (data.price) {
      await stripe.prices.update(planExist.stripePriceId, {
        active: false,
      });
      if (planExist.interval !== 'one_time') {
        const price = await stripe.prices.create({
          unit_amount: Math.round(data.price * 100), // Stripe expects the amount in cents
          currency: 'usd',
          recurring: { interval: planExist.interval },
          product: planExist.stripeProductId,
        });
        data.stripePriceId = price.id;
      }
      // Handle Else case
    }
    return await this._repo.update(id, data);
  }

  async deletePlan(id: string) {
    if (!id) throw new ValidationError('Missing plan id');
    const planExist = await this._repo.planById(id);
    if (!planExist) throw new NotFoundError('Plan not found');
    return await this._repo.delete(id);
  }

  // Need to change this to, First Adding Features separatly and then creating a new Plan Feature by using
  // Plan id and Feature id (Not yet Confirmed)
  async addPlanFeatures(data: PlanFeaturePayload) {
    const { planId, featureId } = data;
    const planExist = await this._repo.planById(planId);
    if (!planExist) throw new NotFoundError('Plan not found');
    const featureExist = await this._repo.featureById(featureId);
    if (!featureExist) throw new NotFoundError('Feature not found');
    return await this._repo.addPlanFeature(data);
  }

  async updatePlanFeatures(id: string, data: Partial<PlanFeaturePayload>) {
    if (!id) throw new ValidationError('Missing id');
    const planFeatureExist = await this._repo.planFeatureById(id);
    if (!planFeatureExist) throw new NotFoundError('Plan feature not found');
    return this._repo.updatePlanFeature(id, data);
  }

  async deletePlanFeature(id: string) {
    const planFeatureExist = await this._repo.planFeatureById(id);
    if (!planFeatureExist) throw new NotFoundError('Plan feature not found');
    return await this._repo.deletePlanFeature(id);
  }
  async planfeatures(planId: string) {
    const planExist = await this._repo.planById(planId);
    if (!planExist) throw new NotFoundError('Plan not found');
    return await this._repo.planFeatures(planId);
  }
  // Individual Features
  async addFeature(data: FeaturePayload) {
    const featureExist = await this._repo.featureByName(data.name);
    if (featureExist) throw new ConflictError('Feature already exist');
    return await this._repo.addFeature(data);
  }
  async updateFeature(id: string, data: Partial<FeaturePayload>) {
    const featureExist = await this._repo.featureById(id);
    if (!featureExist) throw new ConflictError('Feature not found');
    return await this._repo.updateFeature(id, data);
  }
  async deleteFeature(id: string) {
    const featureExist = await this._repo.featureById(id);
    if (!featureExist) throw new ConflictError('Feature not found');
    return await this._repo.deleteFeature(id);
  }
  async features() {
    return await this._repo.features();
  }
}
