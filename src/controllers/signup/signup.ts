import MissingParamError from '../errors/missing-param-error';
import { badRequest, serverError } from '../helpers/http';
import Controller from '../interfaces/controller';
import { HttpRequest } from '../interfaces/http';

export default class SignUpController implements Controller {
  // eslint-disable-next-line class-methods-use-this, consistent-return
  async handle(httpRequest: HttpRequest): Promise<any> {
    try {
      const requiredFields = ['name', 'email', 'document', 'password'];
      for (let index = 0; index < requiredFields.length; index += 1) {
        if (!httpRequest.body[requiredFields[index]]) {
          return badRequest(new MissingParamError(requiredFields[index]));
        }
      }
    } catch (error) {
      return serverError(error);
    }
  }
}
