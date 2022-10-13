import ProductModel from '../../models/product';

export default interface GetProducts {
  get(): Promise<ProductModel[]>;
}
