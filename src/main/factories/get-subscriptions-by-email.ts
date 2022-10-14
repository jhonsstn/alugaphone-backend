import GetSubscriptionsController from '../../controllers/get-subscriptions-by-email/get-subscriptions-by-email';
import Controller from '../../controllers/interfaces/controller';
import SubscriptionMongoRepository from '../../database/mongodb/subscription';
import DbGetSubscriptionsByEmail from '../../services/get-subscriptions-by-email/get-subscriptions-by-email';
import JwtAdapter from '../../services/jwt/jwt-adapter';
import env from '../config/env';

export default function makeGetSubscriptionsByEmailController(): Controller {
  const decrypter = new JwtAdapter(env.secret);
  const subscriptionMongoRepository = new SubscriptionMongoRepository();
  const getSubscriptions = new DbGetSubscriptionsByEmail(subscriptionMongoRepository);
  return new GetSubscriptionsController(getSubscriptions, decrypter);
}
