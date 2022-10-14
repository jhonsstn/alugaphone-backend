import { ObjectId } from 'mongodb';
import ProductModel from '../../models/product';
import GetProductByIdRepository from '../../repositories/get-product-by-id-repository';
import GetProductsRepository from '../../repositories/get-products-repository';
import MongoHelper from '../helpers/mongo-helper';

export default class ProductMongoRepository
implements GetProductsRepository, GetProductByIdRepository {
  async getProducts(): Promise<ProductModel[]> {
    const productCollection = MongoHelper.getCollection('products');
    const products = await productCollection.find().toArray();
    return products && products.map((product) => MongoHelper.mapId(product));
  }

  async getById(id: ObjectId): Promise<ProductModel> {
    const productCollection = MongoHelper.getCollection('products');
    const product = await productCollection.findOne({
      _id: new ObjectId(id),
    });
    return product && MongoHelper.mapId(product);
  }
}
