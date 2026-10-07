export interface Sale {
  id: string;
  type: 'Venta' | 'Cancelación' | 'Devolución';
  amount: number;
  name: string;
  card: string;
  expiration: string;
  cvv: string;
  date: string;

  financialReference?: string;
  approvalNumber?: string;

  cardMasked?: string;
  expirationDisplay?: string;
  cvvMasked?: string;
}
