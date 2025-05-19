import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, StrategyOptions } from 'passport-google-oauth20';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3050/auth/google/callback',
      scope: ['email', 'profile'],
    } as StrategyOptions);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    const { id, displayName, emails, photos } = profile;

    return this.authService.validateOAuthUser(
      'google',
      id,
      emails?.[0]?.value || '',
      displayName,
      photos?.[0]?.value || '',
    );
  }
}
