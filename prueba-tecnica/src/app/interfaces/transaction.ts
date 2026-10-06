export interface Transaction {
  id: string;
  type: string;
  amount: number;
  name: string;
  card: string;
  expiration: string;
  cvv: string;
  date: string;
  reference: string;
}
