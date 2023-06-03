import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../../shared/services/config.service';
// import { AuthorizationService } from '../authentication.service';

@Injectable()
export class AuthLocalJwtStrategy extends PassportStrategy(
  Strategy,
  'local-jwt',
) {
  constructor(
    private configService: ConfigService, // private authService: AuthorizationService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.authenticationSecret,
    });
  }
  async validate(payload: any): Promise<any> {
    console.log('Validate payload: ', payload);
    // const currentUser = await this.authService.OnCustomTokenValidated(payload);
    return payload;
  }
}
