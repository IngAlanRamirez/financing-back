import { Test, TestingModule } from '@nestjs/testing';
import { PurchasesController } from './purchases.controller';
import { PurchasesService } from './purchases.service';
import { UnauthorizedException, ParseUUIDPipe } from '@nestjs/common';

describe('PurchasesController', () => {
  let controller: PurchasesController;
  let service: PurchasesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchasesController],
      providers: [
        {
          provide: PurchasesService,
          useValue: {
            findCandidatePurchases: jest.fn().mockResolvedValue([]),
            findDeferredPurchases: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    controller = module.get<PurchasesController>(PurchasesController);
    service = module.get<PurchasesService>(PurchasesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCandidatePurchases', () => {
    it('should call service method and return its result', async () => {
      const userId = 'u1';
      const mockResult = [{ id: 'p1' }];
      jest.spyOn(service, 'findCandidatePurchases').mockResolvedValue(mockResult as any);

      const result = await controller.getCandidatePurchases(userId);
      expect(service.findCandidatePurchases).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockResult);
    });

  });

  describe('getDeferredPurchases', () => {
    it('should call service method and return its result', async () => {
      const userId = 'u1';
      const mockResult = [{ id: 'p2' }];
      jest.spyOn(service, 'findDeferredPurchases').mockResolvedValue(mockResult as any);

      const result = await controller.getDeferredPurchases(userId);
      expect(service.findDeferredPurchases).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockResult);
    });
  });
});
