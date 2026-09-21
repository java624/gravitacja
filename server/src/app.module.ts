import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentsModule } from './payments/payments.module';
import { PrismaModule } from './prisma/prisma.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [PrismaModule, BookingsModule, PaymentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


