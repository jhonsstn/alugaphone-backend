import Controller from '../../controllers/interfaces/controller';
import SignUpController from '../../controllers/signup/signup';
import AddAccountMongoRepository from '../../database/mongodb-add-account';
import DbAddAccount from '../../services/add-account/add-account';
import BcryptAdapter from '../../services/bcrypt/bcrypt-adapter';
import CPFValidatorAdapter from '../../services/cpf-validator/cpf-validator';
import EmailValidatorAdapter from '../../services/email-validator/email-validator';

export default function makeSignUpController(): Controller {
  const salt = 12;

  const emailValidator = new EmailValidatorAdapter();
  const cpfValidator = new CPFValidatorAdapter();
  const encrypter = new BcryptAdapter(salt);
  const addAccountRepository = new AddAccountMongoRepository();
  const addAccount = new DbAddAccount(encrypter, addAccountRepository);
  return new SignUpController(emailValidator, cpfValidator, addAccount);
}
