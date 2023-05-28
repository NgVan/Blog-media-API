import { CacheModule, Module } from '@nestjs/common';
import { ConfigService } from './services/config.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

const configService = new ConfigService();
const { jwtSecret, accessTokenExpiry } = configService;
@Module({
  imports: [
    CacheModule.register(),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    HttpModule.register({}),
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: accessTokenExpiry },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  exports: [ConfigService, CacheModule, HttpModule, JwtModule],
  providers: [ConfigService, HttpModule, JwtModule],
})
export class SharedModule {}
