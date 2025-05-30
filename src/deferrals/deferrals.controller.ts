import { Controller, Post, Body, Get, Query, ParseUUIDPipe, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { DeferralsService } from './deferrals.service';
import { DeferralRequestDto } from './dto/deferral-request.dto';
import { DeferralReceiptDto } from './dto/deferral-receipt.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Placeholder

@Controller('deferrals')
export class DeferralsController {
  constructor(private readonly deferralsService: DeferralsService) {}

  // @UseGuards(JwtAuthGuard) // Placeholder for real auth
  @Post()
  async createDeferral(
    @Body() deferralRequestDto: DeferralRequestDto,
    @Query('userId', ParseUUIDPipe) userId: string, // Simulate getting userId
  ): Promise<DeferralReceiptDto> {
    if (!userId) {
      throw new UnauthorizedException('userId is required for this mock setup');
    }
    if (!deferralRequestDto.purchaseIds || deferralRequestDto.purchaseIds.length === 0) {
      throw new BadRequestException('At least one purchaseId must be provided.');
    }
    return this.deferralsService.processDeferral(userId, deferralRequestDto);
  }

  @Get('terms-and-conditions')
  getTermsAndConditions(): { title: string; content: string } {
    return {
      title: 'Terms and Conditions for Purchase Deferral Program',
      content: 'These are the detailed terms and conditions... 1. Eligibility... 2. Interest Rates... 3. Payment Obligations...'
    };
  }
}
