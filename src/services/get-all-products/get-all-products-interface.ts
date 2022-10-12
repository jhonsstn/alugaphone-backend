import ProductModel from '../../models/product';

export default interface GetAllProducts {
  get(): Promise<ProductModel[]>;
}
