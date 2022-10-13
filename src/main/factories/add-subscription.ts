import AddSubscriptionController from '../../controllers/add-subscription/add-subscription';
import Controller from '../../controllers/interfaces/controller';
import AccountMongoRepository from '../../database/mongodb/account';
import SubscriptionMongoRepository from '../../database/mongodb/subscription';
import DbAddSubscription from '../../services/add-subscription/add-subscription';
import CPFValidatorAdapter from '../../services/cpf-validator/cpf-validator';
import EmailValidatorAdapter from '../../services/email-validator/email-validator';
import JwtAdapter from '../../services/jwt/jwt-adapter';
import env from '../config/env';

export default function makeAddSubscriptionController(): Controller {
  const decrypter = new JwtAdapter(env.secret);
  const accountRepository = new AccountMongoRepository();
  const emailValidator = new EmailValidatorAdapter(accountRepository);
  const cpfValidator = new CPFValidatorAdapter();
  const subscriptionMongoRepository = new SubscriptionMongoRepository();
  const addSubscription = new DbAddSubscription(subscriptionMongoRepository);
  return new AddSubscriptionController(
    decrypter,
    emailValidator,
    cpfValidator,
    addSubscription,
  );
}
