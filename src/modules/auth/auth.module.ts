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

@Module({
  controllers: [AuthController],
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([UserEntity, AbstractEntity]),
    JwtModule.register({
      global: true,
      secret: new ConfigService().authenticationSecret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, AuthLocalJwtStrategy],
})
export class AuthModule {}
