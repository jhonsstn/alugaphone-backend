import AddSubscription from '../../services/add-subscription/add-subscription-interface';
import CPFValidator from '../../services/cpf-validator/cpf-validator-interface';
import EmailValidator from '../../services/email-validator/email-validator-interface';
import { Decrypter } from '../../services/jwt/jwt-encrypt-interface';
import InvalidParamError from '../errors/invalid-param-error';
import MissingParamError from '../errors/missing-param-error';
import {
  badRequest,
  serverError,
  success,
  unauthorized,
} from '../helpers/http';
import Controller from '../interfaces/controller';
import { HttpRequest } from '../interfaces/http';

export default class AddSubscriptionController implements Controller {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly emailValidator: EmailValidator,
    private readonly cpfValidator: CPFValidator,
    private readonly addSubscription: AddSubscription,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<any> {
    try {
      const requiredFields = [
        'email',
        'document',
        'productId',
        'productCapacity',
        'authorization',
      ];
      for (let index = 0; index < requiredFields.length; index += 1) {
        if (!httpRequest.body[requiredFields[index]]) {
          return badRequest(new MissingParamError(requiredFields[index]));
        }
      }
      const {
        email, document, productId, productCapacity, authorization,
      } = httpRequest.body;

      const tokenData = await this.decrypter.decrypt(authorization);
      if (!tokenData) {
        return unauthorized();
      }

      const isValidEmail = this.emailValidator.isValid(email);
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'));
      }

      const isCPFValid = this.cpfValidator.isValid(document);
      if (!isCPFValid) {
        return badRequest(new InvalidParamError('document'));
      }

      const subscription = await this.addSubscription.add({
        email,
        document,
        productId,
        productCapacity,
      });

      return success(subscription);
    } catch (error) {
      return serverError(error);
    }
  }
}
