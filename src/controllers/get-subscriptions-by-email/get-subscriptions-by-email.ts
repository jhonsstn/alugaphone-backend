import GetSubscriptionsByEmail from '../../services/get-subscriptions-by-email/get-subscriptions-by-email-interface';
import { Decrypter } from '../../services/jwt/jwt-encrypt-interface';
import MissingParamError from '../errors/missing-param-error';
import {
  badRequest,
  noContent,
  serverError,
  success,
  unauthorized,
} from '../helpers/http';
import { HttpRequest, HttpResponse } from '../interfaces/http';

export default class GetSubscriptionsController {
  constructor(
    private readonly getSubscriptionsByEmail: GetSubscriptionsByEmail,
    private readonly decrypter: Decrypter,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!httpRequest.body?.authorization) {
        return badRequest(new MissingParamError('authorization'));
      }
      const { authorization } = httpRequest.body;
      const tokenData = await this.decrypter.decrypt(authorization);
      if (!tokenData) {
        return unauthorized();
      }
      const subscriptions = await this.getSubscriptionsByEmail.get(
        tokenData.email,
      );

      return subscriptions ? success(subscriptions) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
