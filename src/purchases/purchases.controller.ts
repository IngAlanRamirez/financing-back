import { Controller, Get, Query, UseGuards, Req, UnauthorizedException, ParseUUIDPipe } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { PurchaseDto } from './dto/purchase.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Placeholder for when JWT is fully implemented

@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  // In a real app, @UseGuards(JwtAuthGuard) would be used here
  // and userId would be extracted from req.user set by the guard.
  // For now, we'll simulate by taking userId as a query parameter.
  // THIS IS FOR TESTING/DEVELOPMENT ONLY.

  @Get('candidate')
  async getCandidatePurchases(
    @Query('userId', ParseUUIDPipe) userId: string // Simulate getting userId
  ): Promise<PurchaseDto[]> {
    if (!userId) {
      throw new UnauthorizedException('userId is required for this mock setup');
    }
    return this.purchasesService.findCandidatePurchases(userId);
  }

  @Get('deferred')
  async getDeferredPurchases(
    @Query('userId', ParseUUIDPipe) userId: string // Simulate getting userId
  ): Promise<PurchaseDto[]> {
    if (!userId) {
      throw new UnauthorizedException('userId is required for this mock setup');
    }
    return this.purchasesService.findDeferredPurchases(userId);
  }
}
