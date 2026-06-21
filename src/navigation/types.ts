// navigation/types.ts
import { Product } from '../types/Product';
export type RootStackParamList = {
    Home: undefined,
    Products: undefined,
    ProductDetail: {
    product: Product;
  };
};
