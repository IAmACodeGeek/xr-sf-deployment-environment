export default interface Variant{
  id: number;
  price: string;
  compareAtPrice: string | undefined;
  currencyCode: string;
  productId: number;
  selectedOptions: {
    name: string,
    value: string
  }[];
  availableForSale: boolean;  
  inventoryQuantity: number;
}