import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { SharedModule } from '../shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbstractEntity } from 'src/database/entities/abstract.entity';
import { UserEntity } from '../user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/utils/constant';
import { AuthLocalJwtStrategy } from './strategies/local-jwt.strategy';
import { ConfigService } from '../shared/services/config.service';
import { EmailService } from '../shared/services/mail.service';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { AuthEntity } from './entities/auth.entity';

@Module({
  controllers: [AuthController],
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([UserEntity, AbstractEntity, AuthEntity]),
    JwtModule.register({
      global: true,
      secret: new ConfigService().jwtAccessTokenSecret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [
    AuthService,
    AuthLocalJwtStrategy,
    RefreshTokenStrategy,
    EmailService,
  ],
})
export class AuthModule {}
