import { Module } from '@nestjs/common';
import { UserRoleController } from './user-role.controller';
import { UserRoleService } from './user-role.service';

@Module({
  controllers: [UserRoleController],
  providers: [UserRoleService]
})
export class UserRoleModule {}
