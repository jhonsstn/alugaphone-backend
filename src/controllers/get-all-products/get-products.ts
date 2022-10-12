import GetAllProducts from '../../services/get-all-products/get-all-products-interface';
import { noContent, serverError, success } from '../helpers/http';
import Controller from '../interfaces/controller';
import { HttpResponse } from '../interfaces/http';

export default class GetProductsController implements Controller {
  constructor(private readonly getAllProducts: GetAllProducts) {}

  async handle(): Promise<HttpResponse> {
    try {
      const products = await this.getAllProducts.get();
      return products.length ? success(products) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
