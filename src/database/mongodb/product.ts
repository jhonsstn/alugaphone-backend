import GetAllProductsRepository from '../../repositories/get-all-products-repository';
import MongoHelper from '../helpers/mongo-helper';

export default class ProductMongoRepository
implements GetAllProductsRepository {
  async getAllProducts(): Promise<any> {
    const productCollection = MongoHelper.getCollection('products');
    const products = await productCollection.find().toArray();
    return products.map((product) => MongoHelper.mapId(product));
  }
}
