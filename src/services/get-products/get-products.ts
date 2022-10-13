import GetProductsRepository from '../../repositories/get-products-repository';
import GetProducts from './get-products-interface';

export default class DbGetProducts implements GetProducts {
  constructor(private readonly productRepository: GetProductsRepository) {}

  async get(): Promise<any> {
    const products = await this.productRepository.getProducts();
    return products;
  }
}
