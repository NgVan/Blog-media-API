import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { get } from 'lodash';
import { ConfigService } from '../../shared/services/config.service';
import { RequestContext } from '../../../utils/request-context';
import { BaseService } from 'src/database/services/base.service';
import { CommentCreateDto } from '../dtos/request/comment-create.dto';
// import { ContentEntity } from '../entities/content.entity';
import { CommentDto } from '../dtos/response/comment.dto';
import { AbstractFilterDto } from 'src/database/dtos/abstract-filter.dto';
import { DEFAULT_VALUE_FILTER } from 'src/utils/constant';
import { CommentUpdateDto } from '../dtos/request/comment-update.dto';
import { CommentEntity } from '../entities/comment.entity';

@Injectable()
export class CommentService extends BaseService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    // @InjectRepository(ContentEntity)
    // private contentRepository: Repository<ContentEntity>,

    private configService: ConfigService,
  ) {
    super(commentRepository, 'Post');
  }

  async create(payload: CommentCreateDto): Promise<any> {
    const comment = await this.commentRepository.save(payload);
    return {
      data: comment,
      message: 'Create comment successfully',
    };
  }

  async update(payload: CommentUpdateDto, id: string): Promise<any> {
    const foundComment = await this.commentRepository.findOneBy({ id });
    if (!foundComment) throw new NotFoundException('Not found commnet');
    const comment = await this.commentRepository.save({
      id,
      ...payload,
    });
    return {
      data: comment,
      message: 'Update comment successfully',
    };
  }

  async getList(filter: AbstractFilterDto): Promise<any> {
    const {
      page = DEFAULT_VALUE_FILTER.PAGE,
      limit = DEFAULT_VALUE_FILTER.LIMIT,
    } = filter;
    const totalSkip = limit * (page - 1);
    // const query = await this.catRepository
    //   .createQueryBuilder('category')
    //   .take(limit)
    //   .skip(totalSkip);
    // const [res, total] = await query.getManyAndCount();
    // const resMap = res.map((cat) => new CategoryDto(cat));
    // console.log({ res, resMap });

    const [res, total] = await this.commentRepository.findAndCount({
      take: limit,
      skip: totalSkip,
    });

    return {
      entities: res,
      totalEntities: total,
    };
  }

  async getOne(id: string): Promise<CommentDto> {
    const foundComment = await this.commentRepository.findOneBy({ id });
    if (!foundComment) throw new NotFoundException('Not found comment');

    const comment = new CommentDto(foundComment);
    return comment;
  }

  async delete(id: string): Promise<any> {
    const foundCategory = await this.commentRepository.findOneBy({ id });
    if (!foundCategory) throw new NotFoundException('Not found category');
    try {
      await this.commentRepository.delete(foundCategory.id);
    } catch (error) {
      throw error;
    }
    return {
      message: 'Delete comment successfully',
    };
  }
}
