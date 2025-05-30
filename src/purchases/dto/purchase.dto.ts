export enum PurchaseStatus {
  CANDIDATE = 'CANDIDATE',
  DEFERRED = 'DEFERRED',
  PAID = 'PAID',
}

export class PurchaseDto {
  id: string;
  userId: string;
  productName: string;
  amount: number;
  purchaseDate: Date;
  status: PurchaseStatus;
  // Add other purchase-related fields here
}
