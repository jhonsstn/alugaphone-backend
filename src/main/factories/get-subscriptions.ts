import GetSubscriptionsController from '../../controllers/get-subscriptions/get-subscriptions';
import Controller from '../../controllers/interfaces/controller';
import SubscriptionMongoRepository from '../../database/mongodb/subscription';
import DbGetSubscriptions from '../../services/get-subscriptions/get-subscriptions';
import JwtAdapter from '../../services/jwt/jwt-adapter';
import env from '../config/env';

export default function makeGetSubscriptionsController(): Controller {
  const decrypter = new JwtAdapter(env.secret);
  const subscriptionMongoRepository = new SubscriptionMongoRepository();
  const getSubscriptions = new DbGetSubscriptions(subscriptionMongoRepository);
  return new GetSubscriptionsController(getSubscriptions, decrypter);
}
