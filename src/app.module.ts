import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RoleController } from './role/role.controller';
import { RoleModule } from './role/role.module';
import { UserRoleModule } from './user-role/user-role.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [UserModule, RoleModule, UserRoleModule, PostModule],
  controllers: [AppController, RoleController],
  providers: [AppService],
})
export class AppModule {}
