import { Request, Response, NextFunction } from 'express';
import { SubscriptionService } from '../../services/subscription.service';
import { SubscriptionRepository } from '../../repositories/subscription.repository';

const subscriptionService = new SubscriptionService(
  new SubscriptionRepository()
);
const subscribe = async (req: Request, res: Response, next: NextFunction) => {
  const { planId } = req.params;
  if (!planId) {
    res.status(400).json({ error: 'Missing plan id' });
  }
  try {
    const url = await subscriptionService.createSession(req.user!.id, planId);
    res.status(200).json({ url });
  } catch (error) {
    return next(error);
  }
};

const subscriptingSuccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { session_id } = req.query;
  if (!session_id) {
    res.status(400).json({ error: 'Session ID is required' });
    return;
  }
  try {
    const subscription = await subscriptionService.subscriptionSuccess(
      session_id as string
    );
    res.status(200).json({ subscription });
  } catch (error) {
    return next(error);
  }
};

export const subscriptionController = {
  subscribe,
  subscriptingSuccess,
};
