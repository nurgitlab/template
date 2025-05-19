import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Account, User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  //==========

  async validateOAuthUser(
    provider: string,
    providerId: string,
    email: string,
    name: string,
    image: string,
  ): Promise<User> {
    // Ищем существующий аккаунт
    const account = await this.prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId: providerId,
        },
      },
      include: { user: true },
    });

    if (account) return account.user;

    // Если пользователь с таким email уже есть - привязываем аккаунт
    if (email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        await this.createAccount(existingUser.id, provider, providerId);
        return existingUser;
      }
    }

    // Создаем нового пользователя
    return this.prisma.user.create({
      data: {
        email,
        name,
        image,
        emailVerified: !!email,
        accounts: {
          create: {
            provider,
            providerAccountId: providerId,
            providerType: 'oauth',
          },
        },
      },
    });
  }

  private async createAccount(
    userId: string,
    provider: string,
    providerAccountId: string,
  ): Promise<Account> {
    return this.prisma.account.create({
      data: {
        userId,
        provider,
        providerAccountId,
        providerType: 'oauth',
      },
    });
  }
}
