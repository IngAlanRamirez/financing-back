import { PurchaseStatus } from '../dto/purchase.dto';

export interface Purchase {
  id: string;
  userId: string;
  productName: string;
  amount: number;
  purchaseDate: Date;
  status: PurchaseStatus;
  // Add other purchase-related fields here
}

export const MOCK_PURCHASES: Purchase[] = [
  { id: 'p1', userId: '1', productName: 'Laptop', amount: 1200, purchaseDate: new Date('2023-10-01'), status: PurchaseStatus.CANDIDATE },
  { id: 'p2', userId: '1', productName: 'Monitor', amount: 300, purchaseDate: new Date('2023-10-05'), status: PurchaseStatus.CANDIDATE },
  { id: 'p3', userId: '1', productName: 'Keyboard', amount: 75, purchaseDate: new Date('2023-09-20'), status: PurchaseStatus.DEFERRED },
  { id: 'p4', userId: '2', productName: 'Mouse', amount: 25, purchaseDate: new Date('2023-11-01'), status: PurchaseStatus.CANDIDATE },
];
