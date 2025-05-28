import { ConflictException, Injectable } from '@nestjs/common';
import { NewPasswordDto, RegisterDto, SendEmailDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { MailService } from '../mail/mail.service';
import { ConfirmService } from '../confirm/confirm.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly confirmService: ConfirmService,
  ) {}

  async sendConfirmEmail({ email }: SendEmailDto) {
    if (!email) {
      throw new ConflictException('Empty email');
    }
    const confirmEmailToken = await this.confirmService.createOne({ email });

    await this.mailService.sendConfirmMail(email, confirmEmailToken.id);
  }

  async newPassword({ password, token }: NewPasswordDto, res: Response) {
    const getEmailByToken = await this.confirmService.getByToken({ token });
    if (!getEmailByToken) {
      throw new ConflictException('No confirm email found');
    }
    await this.confirmService.deleteOne({ email: getEmailByToken.email });
    const hashedPassword = await hash(password);

    const updatedUser = await this.usersService.updateOne({
      email: getEmailByToken.email,
      hashedPassword,
    });

    return await this.generateTokens(updatedUser.id, res);
  }

  async register({ email, password, token }: RegisterDto, res: Response) {
    const confirmToken = await this.confirmService.getOne({ email });
    if (!confirmToken) {
      throw new ConflictException('No confirm email found');
    }
    if (confirmToken.id !== token) {
      throw new ConflictException('No valid confirm code');
    }
    await this.confirmService.deleteOne({ email });

    const hashedPassword = await hash(password);
    const createdUser = await this.usersService.createOne({
      email,
      hashedPassword,
    });

    return await this.generateTokens(createdUser.id, res);
  }

  async validateUser(email: string, password: string) {
    const userByEmail = await this.usersService.getOne({ email });

    if (!userByEmail) {
      return null;
    }

    if (!userByEmail.hashedPassword) {
      //ToDo - сюда генерировать стандартный пароль, рандомный
      //Todo - здесь можно высылать email со стандартным паролем на почту.
      //Todo - надо при регистрации добавить подтверждение почты, иначе гг.
      throw new ConflictException('You created account, check your email');
    }

    const isValidPassword = await verify(userByEmail.hashedPassword, password);
    if (!isValidPassword) {
      return null;
    }

    return userByEmail;
  }

  async googleAuth(email: string, res: Response) {
    const userByEmail = await this.usersService.getOne({ email });

    if (userByEmail) {
      return await this.generateTokens(userByEmail.id, res);
    }

    const createdUser = await this.usersService.createOne({
      email,
    });

    return this.generateTokens(createdUser.id, res);
  }

  //Private methods
  async generateTokens(userId: string, res: Response) {
    console.log('generateTokens');
    const accessToken = await this.jwtService.signAsync(
      { userId },
      {
        secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.getOrThrow('JWT_ACCESS_EXPIRES'),
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { userId },
      {
        secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.getOrThrow('JWT_REFRESH_EXPIRES'),
      },
    );

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    return accessToken;
  }
}
