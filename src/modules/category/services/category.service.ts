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

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private catRepository: Repository<CategoryEntity>,
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
  ) {}

  async create(payload: CreateCatDto): Promise<any> {
    const { name, picture, isAlbum } = payload;
    const foundCategory = await this.catRepository.findOneBy({ name });
    if (foundCategory)
      throw new ConflictException('Category has already existed');
    const category = await this.catRepository.save({
      name,
      picture,
      isAlbum: isAlbum === '1' ? true : false,
    });
    return {
      data: category,
      message: 'Create category successfully',
    };
  }

  async update(payload: UpdateCatDto, id: string): Promise<any> {
    const foundCategory = await this.catRepository.findOneBy({ id });
    if (!foundCategory) throw new NotFoundException('Not found category');

    const existCategory = await this.catRepository.findOneBy({
      name: payload.name,
    });

    let category;
    if (!existCategory)
      category = await this.catRepository.save({
        id,
        ...payload,
      });
    else {
      if (
        payload.name.toLocaleLowerCase() ===
        foundCategory.name.toLocaleLowerCase()
      )
        category = await this.catRepository.save({
          id,
          ...payload,
        });
      else throw new ConflictException('Category has already existed');
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
    });

    return {
      entities: res,
      totalEntities: total,
    };
  }

  async getPostList(): Promise<any> {
    const categories = await this.catRepository.find({});

    const categoriesWithPosts = await Promise.all(
      categories.map(async (category) => {
        const posts = await this.getTopFourPosts(category.id);
        delete category.subCategories;
        if (posts && posts.length > 0) return { ...category, posts };
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
      .orderBy('post.created', 'DESC')
      .limit(4)
      .getMany();
  }
}
