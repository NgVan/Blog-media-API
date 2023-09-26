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
import { PostEntity } from '../entities/post.entity';
import { PostCreateDto } from '../dtos/request/post-create.dto';
import { ContentEntity } from '../entities/content.entity';
import { PostDto } from '../dtos/response/post.dto';
import { AbstractFilterDto } from 'src/database/dtos/abstract-filter.dto';
import { DEFAULT_VALUE_FILTER } from 'src/utils/constant';
import { PostUpdateDto } from '../dtos/request/post-update.dto';
import { PostQueryDto } from '../dtos/request/post-query.dto';

@Injectable()
export class PostService extends BaseService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    @InjectRepository(ContentEntity)
    private contentRepository: Repository<ContentEntity>,

    private configService: ConfigService,
  ) {
    super(postRepository, 'Post');
  }

  async create(context: RequestContext, payload: PostCreateDto): Promise<any> {
    const { title, subCategoryId, contents: contentsBody } = payload;

    const contents = JSON.parse(contentsBody);

    const userName = get(context, 'user.userName');
    let post: any;
    try {
      post = await this.postRepository.save({
        title,
        subCategoryId,
        author: userName,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }

    const createdContents = contents.map((content: any, index) => {
      return {
        type: content.type,
        value: content.value,
        displayOrder: index + 1,
        postId: post.id,
      };
    });
    try {
      const contentList = await this.contentRepository.insert(createdContents);
      console.log({ contentList });
    } catch (error) {
      throw new BadRequestException(error);
    }

    return {
      data: new PostDto(post),
      message: 'Create post successfully',
    };
  }

  async update(payload: PostUpdateDto, id: string): Promise<any> {
    const { title, contents } = payload;
    const foundPost = await this.postRepository.findOneBy({ id });

    if (title) {
      try {
        await this.postRepository.save({
          id,
          title,
        });
      } catch (error) {
        throw new BadRequestException(error);
      }
    }
    if (contents) {
      // When update Post with content
      // First: Find old content
      // Second: create new content
      // Third: if create new successfully, then delete old content

      // First:
      const oldContent = await this.contentRepository.findBy({
        postId: foundPost.id,
      });
      // const oldContentId = oldContent.map((content) => content.id);

      // Second
      const createdContents = contents.map((content: any, index) => {
        return {
          type: content.type,
          value: content.value,
          displayOrder: index + 1,
          postId: foundPost.id,
        };
      });
      try {
        await this.contentRepository.insert(createdContents);
      } catch (error) {
        throw new BadRequestException(error);
      }

      // Third
      try {
        // const deleteResult = await this.contentRepository
        //   .createQueryBuilder()
        //   .delete()
        //   .where('id IN (:...ids)', { ids: oldContentId })
        //   .execute();

        // const deletedCount = deleteResult.affected;
        // console.log(`Deleted ${deletedCount} content items.`);
        await this.contentRepository.remove(oldContent);
      } catch (error) {
        throw new BadRequestException(error);
      }
    }
    return {
      message: 'Update post successfully',
    };
  }

  async getOne(id: string): Promise<PostDto> {
    const query = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.comments', 'c')
      .leftJoinAndSelect('post.contents', 'ct')
      .leftJoin('c.user', 'u')
      .where('post.id = :id', { id })
      // .orderBy('c.created', 'ASC');
      .addSelect(['u.userName']);

    const foundPost = await query.getOne();
    if (!foundPost) throw new NotFoundException('Not found post');
    // const post = new PostDto(foundPost);
    // return post;
    return foundPost.toDto();
  }

  async getList(filter: PostQueryDto): Promise<any> {
    const {
      page = DEFAULT_VALUE_FILTER.PAGE,
      limit = DEFAULT_VALUE_FILTER.LIMIT,
      categoryId,
      like,
    } = filter;
    const totalSkip = limit * (page - 1);

    const query = this.postRepository
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.subCategory', 'subCategory') // Liên kết với SubCategory
      .innerJoinAndSelect('subCategory.category', 'category') // Liên kết với Category
      // .innerJoinAndSelect('post.contents', 'c')
      // .orderBy('c.displayOrder', 'ASC')
      // .where('category.id = :categoryId', { categoryId: yourCategoryId }) // Thay yourCategoryId bằng ID của Category bạn muốn lấy
      .take(limit)
      .skip(totalSkip);
    if (categoryId) query.where('category.id = :categoryId', { categoryId });

    const [res, total] = await query.clone().getManyAndCount();
    const formattedResult = [];
    const categoryMap = new Map();

    res.forEach((entity) => {
      const categoryId = entity.subCategory.category.id;
      const post = {
        id: entity.id,
        title: entity.title,
        description: entity.description,
        author: entity.author,
        like: entity.like,
        created: entity.created,
        createdTime: new Date(entity.created).getTime(),
      };
      const category = {
        id: categoryId,
        name: entity.subCategory.category.name,
        picture: entity.subCategory.category.picture,
        isAlbum: entity.subCategory.category.isAlbum,
      };

      // Kiểm tra xem Category đã được thêm vào formatEntities chưa
      if (!categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, {
          category,
          posts: [],
        });
      }

      // Thêm bài viết vào danh sách của Category
      categoryMap.get(categoryId).posts.push(post);
    });

    // Sắp xếp các bài viết trong mỗi Category theo trường 'created' giảm dần
    categoryMap.forEach((category) => {
      category.posts.sort((a, b) => b.createdTime - a.createdTime);
      if (like && like === 'DESC') {
        category.posts.sort((a, b) => b.like - a.like);
      }
      if (like && like === 'ASC') {
        category.posts.sort((a, b) => a.like - b.like);
      }
      formattedResult.push(category);
    });

    formattedResult.sort((a, b) =>
      a.category.name.localeCompare(b.category.name),
    );

    return {
      entities: formattedResult,
      totalEntities: total,
    };
  }

  async delete(id: string): Promise<any> {
    const foundPost = await this.postRepository.findOneBy({ id });
    if (!foundPost) throw new NotFoundException('Not found post');
    try {
      await this.contentRepository.delete({ postId: foundPost.id });
      await this.postRepository.delete(foundPost.id);
    } catch (error) {
      throw new BadRequestException(error);
      // throw error;
    }
    return {
      message: 'Delete post successfully',
    };
  }
}
