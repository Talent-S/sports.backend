import { RabbitMQQueues } from '../interfaces';
import { UserProfileRepository } from '../repositories/profile.repository';
import { ProfileService } from '../services/profile.service';
import { RPCObserver } from './rabbitmq';
const userService = new ProfileService(new UserProfileRepository());
export const listenToObservers = async () => {
  RPCObserver(RabbitMQQueues.USER_QUEUE, userService);
};
