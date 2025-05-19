import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { generateRandomString } from '../utlis';
import { CreateUserDto } from './dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Role, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(role?: Role): Promise<User[]> {
    if (role) {
      return this.prisma.user.findMany({
        where: { role: role },
      });
    }

    return this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<User | null> {
    const foundUser = await this.prisma.user.findFirst({ where: { id } });

    if (foundUser === null) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return foundUser;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newId = generateRandomString(10);

    const foundUser = await this.prisma.user.findFirst({
      where: { email: createUserDto.email },
    });

    if (foundUser) {
      throw new ConflictException(`Email error`);
    }

    return this.prisma.user.create({ data: { id: newId, ...createUserDto } });
  }

  async update(id: string, userData: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({ where: { id }, data: userData });
  }

  async delete(id: string): Promise<User | null> {
    try {
      return await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
