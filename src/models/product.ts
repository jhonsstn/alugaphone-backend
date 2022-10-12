export default interface ProductModel {
  id: string;
  name: string;
  prices: {
    capacity: number;
    price: number;
  }[];
  imageUrl: string;
}
