import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto';
import { generateRandomString } from '../utlis';
import { GetUserDto } from './dto/get-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async updateOne({ email, hashedPassword }: UpdateUserDto) {
    const userByEmail = await this.prisma.user.findUnique({ where: { email } });

    if (!userByEmail) {
      throw new ConflictException('Cant find user with email!');
    }

    return this.prisma.user.update({
      where: { id: userByEmail.id },
      data: {
        email: email || userByEmail.email,
        hashedPassword: hashedPassword || userByEmail.hashedPassword,
      },
    });
  }

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
