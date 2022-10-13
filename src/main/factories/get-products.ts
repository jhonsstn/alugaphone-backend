import GetProductsController from '../../controllers/get-all-products/get-products';
import Controller from '../../controllers/interfaces/controller';
import ProductMongoRepository from '../../database/mongodb/product';
import DbGetAllProducts from '../../services/get-all-products/get-all-products';

export default function makeGetProductsController(): Controller {
  const productMongoRepository = new ProductMongoRepository();
  const getAllProducts = new DbGetAllProducts(productMongoRepository);
  return new GetProductsController(getAllProducts);
}
