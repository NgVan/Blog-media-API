import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatQueryDto } from '../dtos/request/CatQuery.dto';
import { DEFAULT_VALUE_FILTER } from 'src/utils/constant';
import { SubCategoryEntity } from 'src/modules/category/entities/subcategory.entity';
import { SubCatCreateDto } from '../dtos/request/subCat-create.dto';
import { SubCatUpdateDto } from '../dtos/request/subCat-update.dto';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectRepository(SubCategoryEntity)
    private subCatRepository: Repository<SubCategoryEntity>,
  ) {}

  async create(payload: SubCatCreateDto): Promise<any> {
    const { name } = payload;
    const foundCategory = await this.subCatRepository.findOneBy({ name });
    if (foundCategory)
      throw new ConflictException('Sub-Category has already existed');
    const category = await this.subCatRepository.save(payload);
    return {
      data: category,
      message: 'Create Sub-category successfully',
    };
  }

  async update(payload: SubCatUpdateDto, id: string): Promise<any> {
    const foundCategory = await this.subCatRepository.findOneBy({ id });
    if (!foundCategory) throw new NotFoundException('Not found Sub-Category');
    const category = await this.subCatRepository.save({
      id,
      ...payload,
    });
    return {
      data: category,
      message: 'Update Sub-category successfully',
    };
  }

  async getOne(id: string): Promise<any> {
    const foundCategory = await this.subCatRepository.findOneBy({ id });
    if (!foundCategory) throw new NotFoundException('Not found Sub-category');
    return foundCategory;
  }

  async getList(filter: CatQueryDto): Promise<any> {
    const {
      page = DEFAULT_VALUE_FILTER.PAGE,
      limit = DEFAULT_VALUE_FILTER.LIMIT,
    } = filter;
    const totalSkip = limit * (page - 1);
    const query = await this.subCatRepository
      .createQueryBuilder('subcategory')
      .take(limit)
      .skip(totalSkip);
    const [res, total] = await query.getManyAndCount();
    // const subMap = res.map((sub) => new SubCategoryDto(sub));
    // console.log({ subMap });
    return {
      entities: res,
      totalEntities: total,
    };
  }

  async delete(id: string): Promise<any> {
    const foundCategory = await this.subCatRepository.findOneBy({ id });
    if (!foundCategory) throw new NotFoundException('Not found Sub-category');
    try {
      await this.subCatRepository.delete(foundCategory.id);
    } catch (error) {
      throw error;
    }
    return {
      message: 'Delete Sub-category successfully',
    };
  }
}
