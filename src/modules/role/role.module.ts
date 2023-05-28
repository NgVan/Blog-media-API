import { Module } from '@nestjs/common';
import { RoleService } from './services/role.service';
import { RoleController } from './role.controller';
import { SharedModule } from '../shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { AbstractEntity } from 'src/database/entities/abstract.entity';

@Module({
  controllers: [RoleController],
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([RoleEntity, AbstractEntity]),
  ],
  providers: [RoleService],
})
export class RoleModule {}
