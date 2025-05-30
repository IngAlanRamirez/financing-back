import { Injectable } from '@nestjs/common';
import { MOCK_PURCHASES, Purchase } from './entities/purchase.entity';
import { PurchaseDto, PurchaseStatus } from './dto/purchase.dto';

@Injectable()
export class PurchasesService {
  // In a real app, data would come from a database via a repository/service.

  async findCandidatePurchases(userId: string): Promise<PurchaseDto[]> {
    return MOCK_PURCHASES.filter(p => p.userId === userId && p.status === PurchaseStatus.CANDIDATE)
      .map(this.mapPurchaseToDto);
  }

  async findDeferredPurchases(userId: string): Promise<PurchaseDto[]> {
    return MOCK_PURCHASES.filter(p => p.userId === userId && p.status === PurchaseStatus.DEFERRED)
      .map(this.mapPurchaseToDto);
  }

  async findPurchasesByIds(purchaseIds: string[], userId: string): Promise<Purchase[]> {
    return MOCK_PURCHASES.filter(p => p.userId === userId && purchaseIds.includes(p.id));
  }

  updatePurchaseStatus(purchaseId: string, newStatus: PurchaseStatus): Purchase | null {
    const purchaseIndex = MOCK_PURCHASES.findIndex(p => p.id === purchaseId);
    if (purchaseIndex > -1) {
      MOCK_PURCHASES[purchaseIndex].status = newStatus;
      return MOCK_PURCHASES[purchaseIndex];
    }
    return null;
  }

  private mapPurchaseToDto(purchase: Purchase): PurchaseDto {
    return {
      id: purchase.id,
      userId: purchase.userId,
      productName: purchase.productName,
      amount: purchase.amount,
      purchaseDate: purchase.purchaseDate,
      status: purchase.status,
    };
  }
}
