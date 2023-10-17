import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository, DataSource, Brackets } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { get } from 'lodash';
import { ConfigService } from '../../shared/services/config.service';
import { RequestContext } from '../../../utils/request-context';
import { BaseService } from 'src/database/services/base.service';
import { PostEntity } from '../entities/post.entity';
import { PostCreateDto } from '../dtos/request/post-create.dto';
import { ContentEntity } from '../entities/content.entity';
import { PostDto } from '../dtos/response/post.dto';
import { DEFAULT_VALUE_FILTER } from 'src/utils/constant';
import { PostUpdateDto } from '../dtos/request/post-update.dto';
import { PostQueryDto } from '../dtos/request/post-query.dto';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { UserPostEntity } from '../entities/userpost.entity';

@Injectable()
export class PostService extends BaseService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    @InjectRepository(ContentEntity)
    private contentRepository: Repository<ContentEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserPostEntity)
    private userPostRepository: Repository<UserPostEntity>,

    private configService: ConfigService,
  ) {
    super(postRepository, 'Post');
  }

  async create(context: RequestContext, payload: PostCreateDto): Promise<any> {
    const {
      title,
      subCategoryId,
      description,
      picture,
      contents: contentsBody,
    } = payload;

    const contents = JSON.parse(contentsBody);

    const userName = get(context, 'user.userName');
    let post: any;
    try {
      post = await this.postRepository.save({
        title,
        subCategoryId,
        description,
        picture,
        author: userName,
        isAccess: 0,
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
      await this.contentRepository.insert(createdContents);
    } catch (error) {
      throw new BadRequestException(error);
    }

    return {
      data: new PostDto(post),
      message: 'Create post successfully',
    };
  }

  async update(payload: PostUpdateDto, id: string): Promise<any> {
    const { title, picture, description, contents: contentsBody } = payload;
    const contents = JSON.parse(contentsBody);
    const foundPost = await this.postRepository.findOneBy({ id });

    if (title) {
      try {
        await this.postRepository.save({
          id,
          title,
          picture,
          description,
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

  async getOnePost(context: RequestContext, id: string): Promise<any> {
    const query = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.comments', 'c')
      .leftJoinAndSelect('post.contents', 'ct')
      .leftJoinAndSelect('post.subCategory', 'subCa')
      // .leftJoinAndSelect('subCa.category', 'cate')
      .leftJoin('c.user', 'u')
      .where('post.id = :id', { id })
      .addSelect(['u.userName']);
    const foundPost = await query.getOne();
    if (!foundPost) throw new NotFoundException('Not found post');

    let likeStatus = false;
    const user = get(context, 'user');

    if (user) {
      const findUser = await this.userRepository.findOneBy({ id: user.sub });
      if (findUser) {
        const findUserPost = await this.userPostRepository.findOneBy({
          userId: user.sub,
          postId: id,
        });
        if (findUserPost) likeStatus = true;
      }
    }

    const categoryId = foundPost.subCategory.categoryId;
    delete foundPost['subCategory'];

    const prevPost = await this.postRepository
      .createQueryBuilder('post')
      .leftJoin('post.subCategory', 'subCa')
      .leftJoin('subCa.category', 'cate')
      .where('cate.id = :categoryId', { categoryId })
      .andWhere('post.isAccess = :isAccess', { isAccess: 1 })
      .andWhere('post.created < :created', { created: foundPost.created })
      .orderBy('post.created', 'DESC')
      .limit(1)
      .getOne();

    const nextPost = await this.postRepository
      .createQueryBuilder('post')
      .leftJoin('post.subCategory', 'subCa')
      .leftJoin('subCa.category', 'cate')
      .where('cate.id = :categoryId', { categoryId })
      .andWhere('post.isAccess = :isAccess', { isAccess: 1 })
      .andWhere('post.created > :created', { created: foundPost.created })
      .andWhere('post.id != :postId', { postId: foundPost.id })
      .orderBy('post.created', 'ASC')
      .limit(1)
      .getOne();

    return { ...foundPost.toDto(), likeStatus, prevPost, nextPost };
  }

  async getListPostByCategory(filter: PostQueryDto): Promise<any> {
    const {
      page = DEFAULT_VALUE_FILTER.PAGE,
      limit = DEFAULT_VALUE_FILTER.LIMIT,
      categoryId,
      subCategoryId,
      like,
    } = filter;
    const totalSkip = limit * (page - 1);

    const query = this.postRepository
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.subCategory', 'subCategory') // Liên kết với SubCategory
      .innerJoinAndSelect('subCategory.category', 'category') // Liên kết với Category
      // .innerJoinAndSelect('post.contents', 'c')
      // .orderBy('c.displayOrder', 'ASC')
      .take(limit)
      .skip(totalSkip);
    if (subCategoryId)
      query.andWhere('subCategory.id = :subCategoryId', { subCategoryId });
    if (categoryId) query.andWhere('category.id = :categoryId', { categoryId });

    const [res, total] = await query.clone().getManyAndCount();
    const formattedResult = [];
    const categoryMap = new Map();

    res.forEach((entity) => {
      const categoryId = entity.subCategory.category.id;
      const post = {
        id: entity.id,
        title: entity.title,
        picture: entity.picture,
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

  async getList(context: RequestContext, filter: PostQueryDto): Promise<any> {
    const user = get(context, 'user');

    const {
      page = DEFAULT_VALUE_FILTER.PAGE,
      limit = DEFAULT_VALUE_FILTER.LIMIT,
      categoryId,
      subCategoryId,
      like,
      searchQuery,
    } = filter;
    const orderByLike: any = like;
    const totalSkip = limit * (page - 1);

    const likedPostIds = [];
    if (user) {
      const findUser = await this.userRepository.findOneBy({ id: user.sub });
      if (findUser) {
        const findUserPostByUser = await this.userPostRepository.findBy({
          userId: user.sub,
        });

        if (findUserPostByUser)
          findUserPostByUser.forEach((i) => likedPostIds.push(i.postId));
      }
    }

    const query = this.postRepository
      .createQueryBuilder('post')
      .innerJoin('post.subCategory', 'subCategory')
      .innerJoin('subCategory.category', 'category')
      .orderBy('post.created', 'DESC')
      .where(
        new Brackets((query) => {
          query.where('post.title LIKE :searchQuery');
        }),
      )
      .andWhere('post.isAccess = :isAccess', { isAccess: 1 })
      .setParameters({ searchQuery: `%${searchQuery}%` })
      .take(limit)
      .skip(totalSkip);

    if (subCategoryId)
      query.andWhere('subCategory.id = :subCategoryId', { subCategoryId });
    if (categoryId) query.andWhere('category.id = :categoryId', { categoryId });
    if (orderByLike) {
      query
        .orderBy('post.like', orderByLike)
        .addOrderBy('post.created', 'DESC');
    }
    const [res, total] = await query.clone().getManyAndCount();
    // const addLikeStatusRes = []
    const addLikeStatusRes = res.map((i) => {
      return {
        ...i,
        likeStatus: likedPostIds.includes(i.id),
      };
    });

    return {
      entities: addLikeStatusRes,
      totalEntities: total,
    };
  }

  async delete(id: string): Promise<any> {
    const foundPost = await this.postRepository.findOneBy({ id });
    if (!foundPost) throw new NotFoundException('Not found post');
    try {
      await this.userPostRepository.delete({ postId: foundPost.id });
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
