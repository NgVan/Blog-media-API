import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../shared/shared.module';
import { AbstractEntity } from 'src/database/entities/abstract.entity';
import { CommentController } from './comment.controller';
import { PostEntity } from '../post/entities/post.entity';
import { CommentService } from './services/comment.service';
import { UserEntity } from '../user/entities/user.entity';
import { CommentEntity } from './entities/comment.entity';

@Module({
  controllers: [CommentController],
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([
      PostEntity,
      UserEntity,
      AbstractEntity,
      CommentEntity,
    ]),
  ],
  providers: [CommentService],
})
export class CommentModule {}
