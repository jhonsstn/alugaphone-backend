import Controller from '../../controllers/interfaces/controller';
import SignUpController from '../../controllers/signup/signup';
import AccountMongoRepository from '../../database/mongodb/account';
import DbAddAccount from '../../services/add-account/add-account';
import BcryptAdapter from '../../services/bcrypt/bcrypt-adapter';
import CPFValidatorAdapter from '../../services/cpf-validator/cpf-validator';
import EmailValidatorAdapter from '../../services/email-validator/email-validator';

import env from '../config/env';

export default function makeSignUpController(): Controller {
  const emailValidator = new EmailValidatorAdapter();
  const cpfValidator = new CPFValidatorAdapter();
  const encrypter = new BcryptAdapter(+env.salt);
  const accountRepository = new AccountMongoRepository();
  const addAccount = new DbAddAccount(encrypter, accountRepository);
  return new SignUpController(emailValidator, cpfValidator, addAccount);
}
