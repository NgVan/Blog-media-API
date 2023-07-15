import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AbstractEntity } from '../entities/abstract.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { omit, flatten } from 'lodash';
import { AbstractFilterDto } from '../../database/dtos/abstract-filter.dto';
import { DEFAULT_VALUE_FILTER } from '../../utils/constant';

@Injectable()
export class BaseService {
  constructor(
    @InjectRepository(AbstractEntity)
    private baseRepository: Repository<AbstractEntity>,
    private controllerName: string,
  ) {}

  async getAll(): Promise<any> {
    const allData = await this.baseRepository.find();
    const entities = flatten(allData).map((item) => omit(item));
    const totalEntities = allData.length;

    return { totalEntities: totalEntities, entities };
  }

  async getListByFilter(filterParam: AbstractFilterDto): Promise<any> {
    const {
      page = DEFAULT_VALUE_FILTER.PAGE,
      limit = DEFAULT_VALUE_FILTER.LIMIT,
    } = filterParam;
    const totalSkip = (page - 1) * limit;

    const [result, total] = await this.baseRepository.findAndCount({
      take: limit,
      skip: totalSkip,
      // withDeleted: withDeleted?.toString() === 'true',
    });

    return {
      entities: result,
      totalEntities: total,
    };
  }

  async getOne(id: string): Promise<any> {
    const data = await this.baseRepository.findOneBy({ id });
    if (!data) throw new NotFoundException(`${this.controllerName} not found`);
    return omit(data);
  }

  async getOneBy(params): Promise<any> {
    const data = await this.baseRepository.findOneBy(params);
    return omit(data);
  }

  async delete(param, trxRepository: any = null): Promise<boolean> {
    const repository = trxRepository
      ? trxRepository.getRepository(this.baseRepository.metadata)
      : this.baseRepository;
    const { affected } = await repository.delete(param);
    return affected !== 0;
  }

  async softDelete(id: string): Promise<any> {
    const data = await this.baseRepository.findOneBy({ id });
    if (!data) throw new NotFoundException(`${this.controllerName} not found`);
    const { affected } = await this.baseRepository.softDelete(id);
    return {
      message: `Delete ${this.controllerName} successfully`,
    };
  }

  async softRemove(id: string, databaseName: string): Promise<boolean> {
    const relations = {};
    relations[databaseName] = true;
    const data = await this.baseRepository.findOne({
      where: { id },
      relations,
    });
    if (!data) throw new NotFoundException(`${this.controllerName} not found`);
    const { deleted } = await this.baseRepository.softRemove(data);

    return deleted != null;
  }

  async create(item: any, trxRepository: any = null): Promise<any> {
    const repository = trxRepository
      ? trxRepository.getRepository(this.baseRepository.metadata)
      : this.baseRepository;
    const checkExistedData = await repository.findOneBy(item);
    if (checkExistedData)
      throw new ConflictException(
        `${this.controllerName} has already conflicted`,
      );

    const result = await repository.save(item);
    return omit(result);
  }

  async update(payload: any, id: string): Promise<any> {
    const data = await this.baseRepository.findOneBy({ id });
    if (!data) throw new NotFoundException(`${this.controllerName} not found`);

    const result = await this.baseRepository.save({ ...data, ...payload, id });

    return omit(result);
  }
}
