import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';

@Controller('api/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('config')
  getConfig() {
    return this.paymentsService.getConfig();
  }

  @Post('create-checkout-session')
  @HttpCode(HttpStatus.OK)
  async createCheckoutSession(@Body() dto: CreateCheckoutSessionDto) {
    return await this.paymentsService.createCheckoutSession(dto);
  }

  @Get('verify-session')
  async verifySession(@Query('sessionId') sessionId: string) {
    return await this.paymentsService.verifySession(sessionId);
  }
}
