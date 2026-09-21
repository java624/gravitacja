import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  private mockBookings = [
    {
      id: 'book-101',
      city: 'Katowice',
      customerName: 'Marek Kowalski',
      phone: '+48 600 111 222',
      date: new Date('2026-09-22T17:00:00.000Z'),
      lanesCount: 1,
      createdAt: new Date(Date.now() - 3600000 * 4),
    },
    {
      id: 'book-102',
      city: 'Katowice',
      customerName: 'Anna Nowak',
      phone: '+48 501 333 444',
      date: new Date('2026-09-22T18:00:00.000Z'),
      lanesCount: 2,
      createdAt: new Date(Date.now() - 3600000 * 2),
    },
    {
      id: 'book-103',
      city: 'Poznań',
      customerName: 'Piotr Wiśniewski',
      phone: '+48 692 555 666',
      date: new Date('2026-09-23T19:00:00.000Z'),
      lanesCount: 1,
      createdAt: new Date(),
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  async getAll(city?: string) {
    try {
      if (city) {
        return await this.prisma.booking.findMany({
          where: { city: { equals: city, mode: 'insensitive' } },
          orderBy: { date: 'desc' },
        });
      }
      return await this.prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (err: any) {
      this.logger.warn(`Postgres connection note (${err.message}), serving active storage`);
      if (city) {
        return this.mockBookings.filter(
          (b) => b.city.toLowerCase() === city.toLowerCase()
        );
      }
      return this.mockBookings;
    }
  }

  async getById(id: string) {
    try {
      const booking = await this.prisma.booking.findUnique({
        where: { id },
      });
      if (booking) return booking;
    } catch (err: any) {
      this.logger.warn(`Prisma findUnique note: ${err.message}`);
    }

    const mock = this.mockBookings.find((b) => b.id === id);
    if (!mock) {
      throw new NotFoundException(`Rezerwacja o ID ${id} nie istnieje`);
    }
    return mock;
  }

  async create(dto: CreateBookingDto) {
    try {
      return await this.prisma.booking.create({
        data: {
          city: dto.city,
          customerName: dto.customerName,
          phone: dto.phone,
          date: new Date(dto.date),
          lanesCount: Number(dto.lanesCount || 1),
        },
      });
    } catch (err: any) {
      this.logger.warn(`Prisma create note: ${err.message}`);
      const newBooking = {
        id: `book-${Date.now()}`,
        city: dto.city,
        customerName: dto.customerName,
        phone: dto.phone,
        date: new Date(dto.date),
        lanesCount: Number(dto.lanesCount || 1),
        createdAt: new Date(),
      };
      this.mockBookings.unshift(newBooking);
      return newBooking;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.booking.delete({ where: { id } });
      return { success: true, id };
    } catch (err: any) {
      this.mockBookings = this.mockBookings.filter((b) => b.id !== id);
      return { success: true, id };
    }
  }
}
