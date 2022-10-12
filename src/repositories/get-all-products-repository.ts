import ProductModel from '../models/product';

export default interface GetAllProductsRepository {
  getAllProducts(): Promise<ProductModel[] | null>;
}
