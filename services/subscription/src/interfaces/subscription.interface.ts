import { Status, Subscription } from '@prisma/client';

export type SubscriptionPayload = Pick<
  Subscription,
  'planId' | 'startDate' | 'endDate' | 'status' | 'userId' | 'stripeId'
>;

export type SubscriptionsQueryResult = {
  currentPage: number;
  totalPages: number;
  subscriptions: Subscription[];
};
export interface SubscriptionRepoInterface {
  create(data: SubscriptionPayload): Promise<Subscription>;
  changeStatus(id: string, status: Status): Promise<Subscription>;
  subscriptionDetails(id: string): Promise<Subscription | null>;
  allSubscriptions(
    page: number,
    limit: number,
    status?: Status
  ): Promise<SubscriptionsQueryResult>;
}
