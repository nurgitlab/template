import { IsEmail, IsString } from 'class-validator';

export class CreateConfirmDto {
  @IsEmail()
  email: string;
}

export class GetEmailDto {
  @IsString()
  token: string;
}
