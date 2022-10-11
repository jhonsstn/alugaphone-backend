import Controller from '../../controllers/interfaces/controller';
import SignInController from '../../controllers/signin/signin';
import AccountMongoRepository from '../../database/mongodb/account';
import Authenticator from '../../services/authentication/authentication';
import BcryptAdapter from '../../services/bcrypt/bcrypt-adapter';
import EmailValidatorAdapter from '../../services/email-validator/email-validator';
import JwtAdapter from '../../services/jwt/jwt-adapter';

import env from '../config/env';

export default function makeSignInController(): Controller {
  const emailValidator = new EmailValidatorAdapter();
  const hashComparer = new BcryptAdapter(+env.salt);
  const accountRepository = new AccountMongoRepository();
  const encrypter = new JwtAdapter(env.secret);
  const authenticator = new Authenticator(
    accountRepository,
    hashComparer,
    encrypter,
  );
  return new SignInController(emailValidator, authenticator);
}
