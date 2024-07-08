import { Injectable } from '@nestjs/common';
import { MyLogger } from '../logger/my-logger.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: MyLogger,
  ) {}

  async getUserPhone(id: number): Promise<string> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });

    return user.phone;
  }
}
