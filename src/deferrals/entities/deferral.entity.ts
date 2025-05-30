import { Purchase } from '../../purchases/entities/purchase.entity';

export interface Deferral {
  id: string;
  userId: string;
  purchases: Purchase[]; // Store copies or references
  totalAmountDeferred: number;
  interestRate: number;
  monthlyPayment: number;
  deferralMonths: 3 | 6 | 9 | 12 | 18 | 24;
  operationDate: Date;
}

export const MOCK_DEFERRALS: Deferral[] = [];
