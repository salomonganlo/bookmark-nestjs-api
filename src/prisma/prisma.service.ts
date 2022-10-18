import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  /**
   * @function
   * For testing
   */
  cleanDb() {
    this.$transaction([this.bookMark.deleteMany(), this.user.deleteMany()]);
  }
}
