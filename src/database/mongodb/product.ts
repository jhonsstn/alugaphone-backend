import GetProductsRepository from '../../repositories/get-products-repository';
import MongoHelper from '../helpers/mongo-helper';

export default class ProductMongoRepository
implements GetProductsRepository {
  async getProducts(): Promise<any> {
    const productCollection = MongoHelper.getCollection('products');
    const products = await productCollection.find().toArray();
    return products.map((product) => MongoHelper.mapId(product));
  }
}
