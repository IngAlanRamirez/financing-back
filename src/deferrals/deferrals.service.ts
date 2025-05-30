import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PurchasesService } from '../purchases/purchases.service';
import { PurchaseStatus, PurchaseDto } from '../purchases/dto/purchase.dto';
import { DeferralRequestDto } from './dto/deferral-request.dto';
import { DeferralReceiptDto } from './dto/deferral-receipt.dto';
import { MOCK_DEFERRALS, Deferral } from './entities/deferral.entity';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

@Injectable()
export class DeferralsService {
  constructor(private readonly purchasesService: PurchasesService) {}

  async processDeferral(userId: string, deferralRequestDto: DeferralRequestDto): Promise<DeferralReceiptDto> {
    const { purchaseIds, deferralMonths } = deferralRequestDto;

    // 1. Fetch and validate purchases
    const selectedPurchases = await this.purchasesService.findPurchasesByIds(purchaseIds, userId);
    if (selectedPurchases.length !== purchaseIds.length) {
      throw new NotFoundException('One or more purchases not found or do not belong to the user.');
    }

    for (const p of selectedPurchases) {
      if (p.status !== PurchaseStatus.CANDIDATE) {
        throw new BadRequestException(`Purchase ${p.id} is not eligible for deferral (status: ${p.status}).`);
      }
    }

    // 2. Calculate deferral details (simplified)
    const totalAmountDeferred = selectedPurchases.reduce((sum, p) => sum + p.amount, 0);
    const interestRate = this.getInterestRate(deferralMonths); // Simple mock interest rate
    const totalAmountWithInterest = totalAmountDeferred * (1 + interestRate);
    const monthlyPayment = totalAmountWithInterest / deferralMonths;

    // 3. Update purchase statuses
    const updatedPurchasesDto: PurchaseDto[] = [];
    for (const purchase of selectedPurchases) {
      const updated = this.purchasesService.updatePurchaseStatus(purchase.id, PurchaseStatus.DEFERRED);
      if (updated) {
        updatedPurchasesDto.push({
            id: updated.id,
            userId: updated.userId,
            productName: updated.productName,
            amount: updated.amount,
            purchaseDate: updated.purchaseDate,
            status: updated.status
        });
      }
    }

    // 4. Create and "save" deferral record
    const newDeferral: Deferral = {
      id: uuidv4(),
      userId,
      purchases: selectedPurchases, // Store a snapshot or full copies
      totalAmountDeferred,
      interestRate,
      monthlyPayment,
      deferralMonths,
      operationDate: new Date(),
    };
    MOCK_DEFERRALS.push(newDeferral);

    // 5. Prepare and return receipt
    const receipt: DeferralReceiptDto = {
      deferralId: newDeferral.id,
      userId,
      selectedPurchases: updatedPurchasesDto,
      totalAmountDeferred,
      interestRate,
      monthlyPayment,
      deferralMonths,
      termsAndConditionsAccepted: true, // Assume accepted for now
      operationDate: newDeferral.operationDate,
    };

    return receipt;
  }

  private getInterestRate(months: number): number {
    // Mock interest rates - can be more complex
    if (months <= 6) return 0.05; // 5%
    if (months <= 12) return 0.07; // 7%
    if (months <= 18) return 0.10; // 10%
    return 0.12; // 12% for 24 months
  }
}
