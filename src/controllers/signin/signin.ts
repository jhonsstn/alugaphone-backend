import { Authentication } from '../../services/authentication/authentication-interface';
import EmailValidator from '../../services/email-validator/email-validator-interface';
import InvalidParamError from '../errors/invalid-param-error';
import MissingParamError from '../errors/missing-param-error';
import {
  badRequest,
  serverError,
  success,
  unauthorized,
} from '../helpers/http';
import Controller from '../interfaces/controller';
import { HttpRequest, HttpResponse } from '../interfaces/http';

export default class SignInController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password'];
      for (let index = 0; index < requiredFields.length; index += 1) {
        if (!httpRequest.body[requiredFields[index]]) {
          return badRequest(new MissingParamError(requiredFields[index]));
        }
      }

      const { email, password } = httpRequest.body;
      const isEmailValid = this.emailValidator.isValid(email);
      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'));
      }

      const accessToken = await this.authentication.auth({ email, password });
      if (!accessToken) {
        return unauthorized();
      }
      return success({ login: accessToken });
    } catch (error) {
      return serverError(error);
    }
  }
}
