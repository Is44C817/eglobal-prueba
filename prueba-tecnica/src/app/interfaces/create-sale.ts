export interface CreateSale {
  id: string;
  type: 'Venta';
  amount: number;
  name: string;
  card: string;
  expiration: string;
  cvv: string;
  date: string;
}
