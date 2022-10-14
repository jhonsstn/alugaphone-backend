import { ObjectId } from 'mongodb';
import ProductModel from '../models/product';

export default interface GetProductByIdRepository {
  getById(id: ObjectId): Promise<ProductModel | null>;
}
