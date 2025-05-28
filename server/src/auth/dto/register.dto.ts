import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsDefined()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(255)
  @IsNotEmpty()
  @IsDefined()
  password: string;

  @IsString()
  @IsDefined()
  token: string;
}

export class NewPasswordDto {
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  @IsNotEmpty()
  @IsDefined()
  password: string;

  @IsString()
  @IsDefined()
  token: string;
}

export class SendEmailDto {
  @IsEmail()
  @IsDefined()
  @IsNotEmpty()
  email: string;
}
