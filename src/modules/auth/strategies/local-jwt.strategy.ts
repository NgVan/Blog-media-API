import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../../shared/services/config.service';
import { Request } from 'express';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthLocalJwtStrategy extends PassportStrategy(
  Strategy,
  'local-jwt',
) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtAccessTokenSecret,
      passReqToCallback: true,
    });
  }
  async validate(req: Request, payload: any): Promise<any> {
    console.log('Validate payload: ', payload);
    const accessToken = req.get('Authorization').replace('Bearer', '').trim();
    const hasAccessToken = await this.authService.hasAccessToken(accessToken);
    return !hasAccessToken ? null : payload;
  }
}
