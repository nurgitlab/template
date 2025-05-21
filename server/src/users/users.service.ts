import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto';
import { generateRandomString } from '../utlis';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createOne({ email, hashedPassword }: CreateUserDto) {
    const userByEmail = await this.prisma.user.findUnique({ where: { email } });

    if (userByEmail) {
      throw new ConflictException('User with email already exists');
    }

    const newId = generateRandomString(10);

    const createdUser = await this.prisma.user.create({
      data: {
        id: newId,
        email,
        hashedPassword,
      },
    });

    return createdUser;
  }

  async getOne({ id, email }: GetUserDto) {
    if (!id && !email) {
      throw new BadRequestException();
    }

    const user = await this.prisma.user.findFirst({ where: { id, email } });

    return user;
  }
}
