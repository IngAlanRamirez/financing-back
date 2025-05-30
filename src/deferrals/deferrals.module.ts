import { Module } from '@nestjs/common';
import { DeferralsController } from './deferrals.controller';
import { DeferralsService } from './deferrals.service';
import { PurchasesModule } from '../purchases/purchases.module';

@Module({
  imports: [PurchasesModule],
  controllers: [DeferralsController],
  providers: [DeferralsService]
})
export class DeferralsModule {}
