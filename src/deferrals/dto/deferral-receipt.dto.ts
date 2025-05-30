import { PurchaseDto } from '../../purchases/dto/purchase.dto';

export class DeferralReceiptDto {
  deferralId: string;
  userId: string;
  selectedPurchases: PurchaseDto[];
  totalAmountDeferred: number;
  interestRate: number; // Example: 0.05 for 5%
  monthlyPayment: number;
  deferralMonths: number;
  termsAndConditionsAccepted: boolean;
  operationDate: Date;
}
