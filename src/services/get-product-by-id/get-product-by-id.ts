import { ObjectId } from 'mongodb';
import ProductModel from '../../models/product';
import GetProductByIdRepository from '../../repositories/get-product-by-id-repository';
import GetProductById from './get-product-by-id-interface';

export default class DbGetProductById implements GetProductById {
  constructor(private readonly productRepository: GetProductByIdRepository) {}

  async getById(id: string): Promise<ProductModel | null> {
    const objectId = new ObjectId(id);
    return this.productRepository.getById(objectId);
  }
}
