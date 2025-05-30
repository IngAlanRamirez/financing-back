import { Test, TestingModule } from '@nestjs/testing';
import { DeferralsService } from './deferrals.service';
import { PurchasesService } from '../purchases/purchases.service';
import { MOCK_PURCHASES as SOURCE_MOCK_PURCHASES_DATA, Purchase } from '../purchases/entities/purchase.entity';
import { PurchaseStatus, PurchaseDto } from '../purchases/dto/purchase.dto';
import { DeferralRequestDto } from './dto/deferral-request.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { MOCK_DEFERRALS } from './entities/deferral.entity';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid', () => ({ v4: jest.fn() }));

// Create a deep copy of the source data ONCE at the top.
const pristineUser1MockPurchases = JSON.parse(JSON.stringify(SOURCE_MOCK_PURCHASES_DATA.filter(p => p.userId === '1')));


describe('DeferralsService', () => {
  let service: DeferralsService;
  let purchasesService: PurchasesService;

  let testUserPurchases: Purchase[]; // This will be a fresh copy for each test

  beforeEach(async () => {
    MOCK_DEFERRALS.length = 0;

    // Reset testUserPurchases from the pristine copy for each test
    testUserPurchases = JSON.parse(JSON.stringify(pristineUser1MockPurchases));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeferralsService,
        {
          provide: PurchasesService,
          useValue: {
            findPurchasesByIds: jest.fn(),
            updatePurchaseStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DeferralsService>(DeferralsService);
    purchasesService = module.get<PurchasesService>(PurchasesService);

    (uuidv4 as jest.Mock).mockReturnValue('test-deferral-id');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processDeferral', () => {
    const userId = '1';
    let deferralRequest: DeferralRequestDto;

    beforeEach(() => {
        const candidatePurchases = testUserPurchases.filter(p => p.status === PurchaseStatus.CANDIDATE);
        // Ensure there are candidate purchases from the testUserPurchases for this test setup
        expect(candidatePurchases.length).toBeGreaterThan(0);

        deferralRequest = {
            purchaseIds: candidatePurchases.map(p => p.id).slice(0,1),
            deferralMonths: 6,
        };

        jest.spyOn(purchasesService, 'findPurchasesByIds').mockImplementation(async (ids, uId) => {
            if (uId !== userId) return [];
            return testUserPurchases.filter(p => ids.includes(p.id));
        });

        jest.spyOn(purchasesService, 'updatePurchaseStatus').mockImplementation((id, status) => {
            const purchase = testUserPurchases.find(p => p.id === id);
            if (purchase) {
                purchase.status = status;
                return {
                    id: purchase.id,
                    userId: purchase.userId,
                    productName: purchase.productName,
                    amount: purchase.amount,
                    purchaseDate: purchase.purchaseDate,
                    status: purchase.status
                } as PurchaseDto;
            }
            return null;
        });
    });

    it('should successfully process a deferral', async () => {
      const result = await service.processDeferral(userId, deferralRequest);

      expect(result.deferralId).toEqual('test-deferral-id');
      expect(result.selectedPurchases.length).toEqual(deferralRequest.purchaseIds.length);
      expect(result.selectedPurchases[0].status).toEqual(PurchaseStatus.DEFERRED);
      expect(MOCK_DEFERRALS.length).toBe(1);
      expect(MOCK_DEFERRALS[0].id).toBe('test-deferral-id');
      expect(purchasesService.updatePurchaseStatus).toHaveBeenCalledWith(deferralRequest.purchaseIds[0], PurchaseStatus.DEFERRED);
    });

    it('should throw NotFoundException if a purchase is not found', async () => {
      jest.spyOn(purchasesService, 'findPurchasesByIds').mockResolvedValue([]);
      await expect(service.processDeferral(userId, deferralRequest)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if a purchase is not a candidate', async () => {
        const purchaseToMakeNonCandidate = testUserPurchases.find(p => p.id === deferralRequest.purchaseIds[0]);
        if(purchaseToMakeNonCandidate) { // Check if found before modifying
            purchaseToMakeNonCandidate.status = PurchaseStatus.DEFERRED;
        } else {
            throw new Error('Test setup error: purchase for deferralRequest not found in testUserPurchases');
        }

        // findPurchasesByIds will return it (now deferred)
        jest.spyOn(purchasesService, 'findPurchasesByIds').mockResolvedValue(
            testUserPurchases.filter(p => deferralRequest.purchaseIds.includes(p.id))
        );

        await expect(service.processDeferral(userId, deferralRequest)).rejects.toThrow(BadRequestException);
    });
  });
});
