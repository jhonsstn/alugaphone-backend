import GetProducts from '../../services/get-products/get-products-interface';
import { noContent, serverError, success } from '../helpers/http';
import Controller from '../interfaces/controller';
import { HttpResponse } from '../interfaces/http';

export default class GetProductsController implements Controller {
  constructor(private readonly getProducts: GetProducts) {}

  async handle(): Promise<HttpResponse> {
    try {
      const products = await this.getProducts.get();
      return products.length ? success(products) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
