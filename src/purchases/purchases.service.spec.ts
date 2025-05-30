import { Test, TestingModule } from '@nestjs/testing';
import { PurchasesService } from './purchases.service';
// Import the original data source directly
import { MOCK_PURCHASES as SOURCE_MOCK_PURCHASES_DATA, Purchase } from './entities/purchase.entity';
import { PurchaseStatus, PurchaseDto } from './dto/purchase.dto';

// This is the reference to the array that the PurchasesService actually imports and uses.
import { MOCK_PURCHASES as ServiceInternalMockPurchases } from './entities/purchase.entity';

// Create a deep copy of the source data ONCE at the top, to use as a clean slate for resets.
const pristineMockPurchases = JSON.parse(JSON.stringify(SOURCE_MOCK_PURCHASES_DATA));

describe('PurchasesService', () => {
  let service: PurchasesService;

  beforeEach(async () => {
    // Reset the array used by the service to a pristine state
    ServiceInternalMockPurchases.length = 0;
    pristineMockPurchases.forEach(p => ServiceInternalMockPurchases.push(JSON.parse(JSON.stringify(p))));

    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchasesService],
    }).compile();
    service = module.get<PurchasesService>(PurchasesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findCandidatePurchases', () => {
    it('should return candidate purchases for a user', async () => {
      const userId = '1';
      const result = await service.findCandidatePurchases(userId);
      // User '1' has 2 candidate purchases in the pristine mock data
      expect(result.length).toBe(2);
      result.forEach(p => expect(p.status).toEqual(PurchaseStatus.CANDIDATE));
    });

    it('should return empty array if no candidate purchases for a specific user', async () => {
      const userIdWithNoCandidates = 'nonExistentUser';
      const result = await service.findCandidatePurchases(userIdWithNoCandidates);
      expect(result).toEqual([]);
    });

    it('should return empty array if user candidate purchases are modified to non-candidate', async () => {
      const userId = '1';
      ServiceInternalMockPurchases.filter(p => p.userId === userId).forEach(p => p.status = PurchaseStatus.DEFERRED);

      const result = await service.findCandidatePurchases(userId);
      expect(result).toEqual([]);
    });
  });

  describe('updatePurchaseStatus', () => {
    it('should update a purchase status and return the updated purchase', () => {
        const purchaseToUpdate = ServiceInternalMockPurchases.find(p => p.userId === '1' && p.status === PurchaseStatus.CANDIDATE);
        expect(purchaseToUpdate).toBeDefined();

        const updated = service.updatePurchaseStatus(purchaseToUpdate!.id, PurchaseStatus.DEFERRED);
        expect(updated).toBeDefined();
        expect(updated?.status).toEqual(PurchaseStatus.DEFERRED);

        const foundInMock = ServiceInternalMockPurchases.find(p=> p.id === purchaseToUpdate!.id);
        expect(foundInMock?.status).toEqual(PurchaseStatus.DEFERRED);
    });

    it('should return null if purchase to update is not found', () => {
      const updated = service.updatePurchaseStatus('nonExistentId', PurchaseStatus.DEFERRED);
      expect(updated).toBeNull();
    });
  });

  describe('findPurchasesByIds', () => {
    it('should find purchases by their IDs for a specific user', async () => {
      const userId = '1';
      const purchasesToFind = ServiceInternalMockPurchases.filter(p => p.userId === userId).slice(0, 2);
      const purchaseIdsToFind = purchasesToFind.map(p => p.id);
      expect(purchaseIdsToFind.length).toBe(2); // Ensure we selected some IDs

      const result = await service.findPurchasesByIds(purchaseIdsToFind, userId);
      expect(result.length).toEqual(purchasesToFind.length);
      result.forEach(p => expect(purchaseIdsToFind).toContain(p.id));
    });

    it('should return empty array if IDs are not found or do not belong to user', async () => {
      const result = await service.findPurchasesByIds(['nonExistentId'], '1');
      expect(result).toEqual([]);

      const otherUserPurchaseId = ServiceInternalMockPurchases.find(p => p.userId === '2')?.id;
      expect(otherUserPurchaseId).toBeDefined();
      if(otherUserPurchaseId) {
         const resultUserMismatch = await service.findPurchasesByIds([otherUserPurchaseId], '1');
         expect(resultUserMismatch).toEqual([]);
      }
    });
  });

  describe('findDeferredPurchases', () => {
    it('should return deferred purchases for a user', async () => {
      const userId = '1';
      // User '1' has 1 deferred purchase in the pristine mock data
      const result = await service.findDeferredPurchases(userId);
      expect(result.length).toBe(1);
      result.forEach(p => expect(p.status).toEqual(PurchaseStatus.DEFERRED));
    });
  });
});
