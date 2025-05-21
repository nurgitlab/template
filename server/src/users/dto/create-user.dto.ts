import { OmitType } from '@nestjs/mapped-types';
import { IsEmail, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  hashedPassword: string;
}

export class CreateUserDto extends OmitType(UserDto, ['id']) {}
