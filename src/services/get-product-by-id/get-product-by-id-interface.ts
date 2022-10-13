import ProductModel from '../../models/product';

export default interface GetProductById {
  getById(id: string): Promise<ProductModel | null>;
}
