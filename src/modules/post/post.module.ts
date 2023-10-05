import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../shared/shared.module';
import { AbstractEntity } from 'src/database/entities/abstract.entity';
import { PostController } from './post.controller';
import { PostEntity } from './entities/post.entity';
import { PostService } from './services/post.service';
import { ContentEntity } from './entities/content.entity';
import { UserEntity } from '../user/entities/user.entity';
import { UserPostEntity } from './entities/userpost.entity';

@Module({
  controllers: [PostController],
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([
      PostEntity,
      ContentEntity,
      AbstractEntity,
      UserEntity,
      UserPostEntity,
    ]),
  ],
  providers: [PostService],
})
export class PostModule {}
