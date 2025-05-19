import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // Инициирует OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req: Request) {
    return {
      message: 'Google auth successful',
      user: req.user,
    };
  }

  @Get('protected')
  @UseGuards(AuthGuard('jwt')) // Или другая защита
  protectedRoute() {
    return { message: 'This is protected data' };
  }
}
