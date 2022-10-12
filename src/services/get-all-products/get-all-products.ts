import GetAllProductsRepository from '../../repositories/get-all-products-repository';
import GetAllProducts from './get-all-products-interface';

export default class DbGetAllProducts implements GetAllProducts {
  constructor(private readonly productRepository: GetAllProductsRepository) {}

  async get(): Promise<any> {
    const products = await this.productRepository.getAllProducts();
    return products;
  }
}
