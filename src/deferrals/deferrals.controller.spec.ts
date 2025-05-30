import { Test, TestingModule } from '@nestjs/testing';
import { DeferralsController } from './deferrals.controller';
import { DeferralsService } from './deferrals.service';
import { DeferralRequestDto } from './dto/deferral-request.dto';
import { DeferralReceiptDto } from './dto/deferral-receipt.dto';
import { BadRequestException } from '@nestjs/common';

describe('DeferralsController', () => {
  let controller: DeferralsController;
  let service: DeferralsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeferralsController],
      providers: [
        {
          provide: DeferralsService,
          useValue: {
            processDeferral: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DeferralsController>(DeferralsController);
    service = module.get<DeferralsService>(DeferralsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createDeferral', () => {
    it('should call service.processDeferral and return its result', async () => {
      const userId = 'user123';
      const dto: DeferralRequestDto = { purchaseIds: ['p1'], deferralMonths: 6 };
      const mockReceipt: DeferralReceiptDto = {
        deferralId: 'd1', userId: 'user123', selectedPurchases: [], totalAmountDeferred: 100,
        interestRate: 0.05, monthlyPayment: 17.5, deferralMonths: 6,
        termsAndConditionsAccepted: true, operationDate: new Date()
      };
      jest.spyOn(service, 'processDeferral').mockResolvedValue(mockReceipt);

      const result = await controller.createDeferral(dto, userId);
      expect(service.processDeferral).toHaveBeenCalledWith(userId, dto);
      expect(result).toEqual(mockReceipt);
    });

    it('should throw BadRequestException if purchaseIds is empty', async () => {
        const userId = 'user123';
        const dto: DeferralRequestDto = { purchaseIds: [], deferralMonths: 6 };
        await expect(controller.createDeferral(dto, userId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getTermsAndConditions', () => {
    it('should return terms and conditions object', () => {
      const result = controller.getTermsAndConditions();
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('content');
    });
  });
});
