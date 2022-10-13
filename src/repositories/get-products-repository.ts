import ProductModel from '../models/product';

export default interface GetProductsRepository {
  getProducts(): Promise<ProductModel[] | null>;
}
