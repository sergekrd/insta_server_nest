import { Injectable } from '@nestjs/common';
import { IgApiClient } from 'instagram-private-api';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class CookiesService {
  constructor(private readonly prisma: PrismaService) {}
  async saveSession(ig: IgApiClient, username: string) {
    const serialized = await ig.state.serialize();
    delete serialized.constants;
    const userId = await this.getUserId(username);
    const cookies = await this.prisma.cookies.findUnique({
      where: {
        account: userId,
      },
    });
    if (cookies) {
      await this.prisma.cookies.update({
        where: {
          account: userId,
        },
        data: {
          cookie: JSON.stringify(serialized),
        },
      });
    } else {
      await this.prisma.cookies.create({
        data: {
          cookie: JSON.stringify(serialized),
          accounts: { connect: { id: userId } },
        },
      });
    }
    return true;
  }

  async loadSession(username: string) {
    const userWithCookies = await this.prisma.accounts.findUnique({
      where: {
        username: username,
      },
      include: {
        cookies: true,
      },
    });
    if (!userWithCookies?.cookies) {
      console.log(`${username}: кукиз нет`);
      return false;
    }
    console.log(`${username}: кукиз есть`);
    return userWithCookies.cookies;
  }

  async getUserId(username: string) {
    const user = await this.prisma.accounts.findUnique({
      where: {
        username: username,
      },
    });
    if (!user) return;
    return user.id;
  }
}
