import { ObjectId } from 'mongodb';
import GetProductByIdRepository from '../../repositories/get-product-by-id-repository';
import GetProductsRepository from '../../repositories/get-products-repository';
import MongoHelper from '../helpers/mongo-helper';

export default class ProductMongoRepository
implements GetProductsRepository, GetProductByIdRepository {
  async getProducts(): Promise<any> {
    const productCollection = MongoHelper.getCollection('products');
    const products = await productCollection.find().toArray();
    return products && products.map((product) => MongoHelper.mapId(product));
  }

  async getById(id: string): Promise<any> {
    const productCollection = MongoHelper.getCollection('products');
    const product = await productCollection.findOne({
      _id: new ObjectId(id),
    });
    return product && MongoHelper.mapId(product);
  }
}
