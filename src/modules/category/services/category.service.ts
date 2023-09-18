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

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private catRepository: Repository<CategoryEntity>,
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
    const category = await this.catRepository.save({
      id,
      ...payload,
    });
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
}
