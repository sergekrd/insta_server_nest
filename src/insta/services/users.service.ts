import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UsersService {
  private readonly prisma: PrismaService;
  async saveUser(username: string, password: string) {
    const user = await this.prisma.accounts.findUnique({
      where: {
        username: username,
      },
    });
    if (!user) {
      await this.prisma.accounts.create({
        data: { username, password },
      });
    }
  }
}
