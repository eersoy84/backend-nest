import {
  INestApplication,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export class PrismaService
  extends PrismaClient
  implements OnModuleInit
{
  constructor() {
    super();
  }
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(
    app: INestApplication,
  ) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
