import { Subscription, Status, PrismaClient } from '@prisma/client';
import {
  SubscriptionPayload,
  SubscriptionRepoInterface,
  SubscriptionsQueryResult,
} from '../interfaces/subscription.interface';

export class SubscriptionRepository implements SubscriptionRepoInterface {
  private _prisma: PrismaClient;
  constructor() {
    this._prisma = new PrismaClient();
  }
  async create(data: SubscriptionPayload): Promise<Subscription> {
    return await this._prisma.subscription.create({ data });
  }
  async changeStatus(id: string, status: Status): Promise<Subscription> {
    return await this._prisma.subscription.update({
      where: { id },
      data: { status },
    });
  }
  async subscriptionDetails(id: string): Promise<Subscription | null> {
    return await this._prisma.subscription.findUnique({
      where: { id },
      include: { plan: true },
    });
  }
  async allSubscriptions(
    page: number,
    limit: number,
    status?: Status
  ): Promise<SubscriptionsQueryResult> {
    let query: { status?: Status } = status ? { status } : {};
    const totalSubscriptions = await this._prisma.subscription.count({
      where: query,
    });
    const subscriptions = await this._prisma.subscription.findMany({
      where: query,
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      currentPage: page,
      totalPages: totalSubscriptions,
      subscriptions,
    };
  }
}
