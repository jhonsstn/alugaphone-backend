import GetProductById from '../../services/get-product-by-id/get-product-by-id-interface';
import { serverError, noContent, success } from '../helpers/http';

import Controller from '../interfaces/controller';
import { HttpRequest, HttpResponse } from '../interfaces/http';

export default class GetProductByIdController implements Controller {
  constructor(private readonly getProductById: GetProductById) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.body;
      const product = await this.getProductById.getById(id);
      return product ? success(product) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
