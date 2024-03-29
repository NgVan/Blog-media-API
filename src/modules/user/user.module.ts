import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../shared/shared.module';
import { AbstractEntity } from 'src/database/entities/abstract.entity';
import { AuthEntity } from '../auth/entities/auth.entity';

@Module({
  controllers: [UserController],
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([UserEntity, AbstractEntity, AuthEntity]),
  ],
  providers: [UserService],
})
export class UserModule {}
