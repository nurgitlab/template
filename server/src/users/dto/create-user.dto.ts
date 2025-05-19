import { OmitType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { Role } from '@prisma/client';

export class UserDto {
  @IsString()
  id: string;

  @IsInt()
  @Min(0, {
    message: 'Тебе не может быть меньше 0',
  })
  @Max(100)
  age: number;

  @Length(4, 20)
  name: string;

  @IsEnum(Role)
  role: Role;

  @IsEmail()
  email: string;
}

export class CreateUserDto extends OmitType(UserDto, ['id']) {}
