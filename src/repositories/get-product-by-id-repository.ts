import ProductModel from '../models/product';

export default interface GetProductByIdRepository {
  getById(id: string): Promise<ProductModel | null>;
}
