import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('api/bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  async getAll(@Query('city') city?: string) {
    return this.bookingsService.getAll(city);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.bookingsService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateBookingDto) {
    return this.bookingsService.create(dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }
}
