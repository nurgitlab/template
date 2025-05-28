import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { NewPasswordDto, RegisterDto, SendEmailDto } from './dto/register.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../utlis';
import { GoogleGuard } from './guards/google.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.register(registerDto, res);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @CurrentUser('id') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.generateTokens(userId, res);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  async refresh(
    @CurrentUser('id') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('refresh', userId);
    return await this.authService.generateTokens(userId, res);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('refreshToken', '');
  }

  @UseGuards(GoogleGuard)
  @Get('google')
  async google() {}

  @UseGuards(GoogleGuard)
  @Get('google/callback')
  async googleCallback(
    @Req() req: Request & { user: { _json: { email: string } } },
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('req.user', req.user);

    return await this.authService.googleAuth(req.user._json.email, res);
  }

  //ConfirmEmail

  //Send Email
  @Post('sendmail')
  async confirm(@Body() { email }: SendEmailDto) {
    return await this.authService.sendConfirmEmail({ email });
  }

  @Post('newpassword')
  async newpassword(
    @Body() newPasswordDto: NewPasswordDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.newPassword(newPasswordDto, res);
  }

  // @Get('confirm/email')
  // async confirmEmail(@Query('token') email: string) {
  //   if (!email) {
  //     throw new NotFoundException();
  //   }
  //
  //   return await this.authService.sendConfirmEmail({ email });
  // }
}
