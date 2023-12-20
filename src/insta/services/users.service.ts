import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

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
  async updateUserPk(username: string, user_pk: number) {
    const user = await this.prisma.accounts.findUnique({
      where: {
        username: username,
      },
    });
    if (!user) {
      await this.prisma.accounts.update({
        data: { user_pk },
        where: { username },
      });
    }
  }
  async getUserPk(username: string) {
    const user = await this.prisma.accounts.findUnique({
      where: {
        username: username,
      },
    });
    if (!user) throw new Error(`Dont find ${username} in getUserPk`);
    return user.user_pk;
  }
}
