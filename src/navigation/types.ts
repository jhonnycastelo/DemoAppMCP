// navigation/types.ts
import { Product } from '../../App';
export type RootStackParamList = {
    AppRoot: undefined,
    ProductDetail: {
    product: Product;
  };
};
