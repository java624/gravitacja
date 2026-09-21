import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const connectionString =
      process.env.DATABASE_URL ||
      'postgresql://postgres:Qd2cVRUrGPig7Zsq@db.azsukxryriiurewwoain.supabase.co:5432/postgres';
    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Connected to PostgreSQL database via Prisma (pg adapter)');
    } catch (err: any) {
      this.logger.warn(`PostgreSQL connection check note: ${err.message}`);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
