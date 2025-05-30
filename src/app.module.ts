import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PurchasesModule } from './purchases/purchases.module';
import { DeferralsModule } from './deferrals/deferrals.module';

@Module({
  imports: [AuthModule, UsersModule, PurchasesModule, DeferralsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
