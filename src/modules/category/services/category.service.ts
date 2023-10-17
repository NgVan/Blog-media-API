import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCatDto } from '../dtos/request/createCat.dto';
import { UpdateCatDto } from '../dtos/request/updateCat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { CatQueryDto } from '../dtos/request/CatQuery.dto';
import { DEFAULT_VALUE_FILTER } from 'src/utils/constant';
import { CategoryDto } from '../dtos/response/cat.dto';
import { PostEntity } from 'src/modules/post/entities/post.entity';
import { get } from 'lodash';
import { RequestContext } from 'src/utils/request-context';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { UserPostEntity } from 'src/modules/post/entities/userpost.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private catRepository: Repository<CategoryEntity>,
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserPostEntity)
    private userPostRepository: Repository<UserPostEntity>,
  ) {}

  async create(payload: CreateCatDto): Promise<any> {
    const { name, picture, isAlbum } = payload;
    const foundCategory = await this.catRepository.findOneBy({ name });
    if (foundCategory)
      throw new ConflictException('Category has already existed');
    const lastCategory = await this.catRepository.findOne({
      where: {},
      order: { orderNo: 'DESC' },
    });
    let nextOrder = 1;
    if (lastCategory) nextOrder = lastCategory.orderNo + 1;
    const category = await this.catRepository.save({
      name,
      picture,
      isAlbum: isAlbum === '1' ? true : false,
      orderNo: nextOrder,
    });
    return {
      data: category,
      message: 'Create category successfully',
    };
  }

  async update(payload: UpdateCatDto, id: string): Promise<any> {
    console.log({ payload });

    const foundCategory = await this.catRepository.findOneBy({ id });
    if (!foundCategory) throw new NotFoundException('Not found category');
    let findCateByOrder;
    let currentOrder;
    if (payload.orderNo) {
      console.log('GO TO 1');

      currentOrder = foundCategory.orderNo;
      findCateByOrder = await this.catRepository.findOneBy({
        orderNo: payload.orderNo,
      });
    }
    const existCategory = await this.catRepository.findOneBy({
      name: payload.name,
    });

    let category;
    if (!existCategory)
      category = await this.catRepository.save({
        id,
        ...payload,
        orderNo: payload.orderNo,
      });
    else {
      if (
        payload.name.toLocaleLowerCase() ===
        foundCategory.name.toLocaleLowerCase()
      )
        category = await this.catRepository.save({
          id,
          ...payload,
          orderNo: payload.orderNo,
        });
      else throw new ConflictException('Category has already existed');
    }
    if (payload.orderNo) {
      console.log('GO TO 2');

      await this.catRepository.save({
        id: findCateByOrder.id,
        orderNo: currentOrder,
      });
    }

    return {
      data: category,
      message: 'Update category successfully',
    };
  }

  async getOne(id: string): Promise<CategoryDto> {
    const foundCategory = await this.catRepository.findOneBy({ id });
    if (!foundCategory) throw new NotFoundException('Not found category');
    console.log({ foundCategory });

    const cate = new CategoryDto(foundCategory);
    return cate;
  }

  async getList(filter: CatQueryDto): Promise<any> {
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

    const [res, total] = await this.catRepository.findAndCount({
      take: limit,
      skip: totalSkip,
      order: {
        orderNo: 'ASC',
      },
    });

    return {
      entities: res,
      totalEntities: total,
    };
  }

  async getPostList(context: RequestContext): Promise<any> {
    const user = get(context, 'user');

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
    console.log({ likedPostIds });

    const categories = await this.catRepository.find({
      order: {
        orderNo: 'ASC',
      },
    });

    const categoriesWithPosts = await Promise.all(
      categories.map(async (category) => {
        const posts = await this.getTopFourPosts(category.id);
        const addLikeStatusPosts = posts.map((i) => {
          return {
            ...i,
            likeStatus: likedPostIds.includes(i.id),
          };
        });
        delete category.subCategories;
        if (posts && posts.length > 0)
          return { ...category, posts: addLikeStatusPosts };
      }),
    );
    const result = categoriesWithPosts.filter((i) => i !== undefined);
    return {
      entities: result,
      totalEntities: result.length,
    };
  }

  async delete(id: string): Promise<any> {
    const foundCategory = await this.catRepository.findOneBy({ id });
    if (!foundCategory) throw new NotFoundException('Not found category');
    try {
      await this.catRepository.delete(foundCategory.id);
    } catch (error) {
      throw error;
    }
    return {
      message: 'Delete category successfully',
    };
  }

  async getTopFourPosts(categoryId: string) {
    return this.postRepository
      .createQueryBuilder('post')
      .innerJoin('post.subCategory', 'subCategory') // Liên kết với SubCategory
      .innerJoin('subCategory.category', 'category') // Liên kết với Category
      .where('category.id = :categoryId', { categoryId })
      .andWhere('post.isAccess = :isAccess', { isAccess: 1 })
      .orderBy('post.created', 'DESC')
      .limit(4)
      .getMany();
  }
}
