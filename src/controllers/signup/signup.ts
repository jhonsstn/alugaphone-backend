import CPFValidator from '../../services/cpf-validator/cpf-validator-interface';
import EmailValidator from '../../services/email-validator/email-validator-interface';
import InvalidParamError from '../errors/invalid-param-error';
import MissingParamError from '../errors/missing-param-error';
import { badRequest, serverError } from '../helpers/http';
import Controller from '../interfaces/controller';
import { HttpRequest } from '../interfaces/http';

export default class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly cpfValidator: CPFValidator,
  ) {}

  // eslint-disable-next-line class-methods-use-this, consistent-return
  async handle(httpRequest: HttpRequest): Promise<any> {
    try {
      const requiredFields = ['name', 'email', 'document', 'password'];
      for (let index = 0; index < requiredFields.length; index += 1) {
        if (!httpRequest.body[requiredFields[index]]) {
          return badRequest(new MissingParamError(requiredFields[index]));
        }
      }

      const { email, document } = httpRequest.body;
      const isEmailValid = this.emailValidator.isValid(email);
      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'));
      }

      const isCPFValid = this.cpfValidator.isValid(document);
      if (!isCPFValid) {
        return badRequest(new InvalidParamError('document'));
      }
    } catch (error) {
      return serverError(error);
    }
  }
}
