import config from '../config';
import { stripe } from '../config/stripe.config';
import { SubscriptionRepoInterface } from '../interfaces/subscription.interface';
import { PlanRepository } from '../repositories/plan.repository';
import { NotFoundError, ValidationError } from '../utils/error';

export class SubscriptionService {
  private _planRepo = new PlanRepository();
  private _repo: SubscriptionRepoInterface;
  constructor(repo: SubscriptionRepoInterface) {
    this._repo = repo;
  }

  async createSession(userId: string, planId: string) {
    const planExist = await this._planRepo.planById(planId);
    if (!planExist) throw new NotFoundError('Plan not found');
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: planExist.stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `${config.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.CLIENT_URL}/cancel`,
      metadata: {
        userId,
        planId,
      },
    });
    return session.url;
  }

  async subscriptionSuccess(sessionId: string) {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const userId = session.metadata?.userId;
    const planId = session.metadata?.planId;
    const stripeSubscriptionId = session.subscription as string;
    if (!userId || !planId) {
      throw new ValidationError('Invalid session metadata');
    }
    return await this._repo.create({
      planId,
      userId,
      stripeId: stripeSubscriptionId,
      startDate: new Date(session.created * 1000),
      endDate: new Date(session.expires_at ? session.expires_at * 1000 : 0),
      status: 'ACTIVE',
    });
  }
}
