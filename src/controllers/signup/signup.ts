import AddAccount from '../../services/add-account/add-account-interface';
import CPFValidator from '../../services/cpf-validator/cpf-validator-interface';
import EmailValidator from '../../services/email-validator/email-validator-interface';
import InvalidParamError from '../errors/invalid-param-error';
import MissingParamError from '../errors/missing-param-error';
import {
  badRequest, conflict, serverError, success,
} from '../helpers/http';
import Controller from '../interfaces/controller';
import { HttpRequest, HttpResponse } from '../interfaces/http';

export default class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly cpfValidator: CPFValidator,
    private readonly addAccount: AddAccount,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'document', 'password'];
      for (let index = 0; index < requiredFields.length; index += 1) {
        if (!httpRequest.body[requiredFields[index]]) {
          return badRequest(new MissingParamError(requiredFields[index]));
        }
      }

      const { email, document } = httpRequest.body;

      const emailAlreadyExists = await this.emailValidator.checkIfAccountExists(
        email,
      );
      if (emailAlreadyExists) {
        return conflict();
      }

      const isEmailValid = this.emailValidator.isValid(email);
      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'));
      }

      const isCPFValid = this.cpfValidator.isValid(document);
      if (!isCPFValid) {
        return badRequest(new InvalidParamError('document'));
      }

      const account = await this.addAccount.add(httpRequest.body);

      return success(account);
    } catch (error) {
      return serverError(error);
    }
  }
}
