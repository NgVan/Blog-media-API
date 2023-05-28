import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { RoleEntity } from '../entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmpty, omit } from 'lodash';
import { ConfigService } from '../../shared/services/config.service';
import { RequestContext } from '../../../utils/request-context';
import { RoleDto } from '../dtos/response/role.dto';
import { RoleCreateDto } from '../dtos/request/role-create.dto';
import { BaseService } from 'src/database/services/base.service';

@Injectable()
export class RoleService extends BaseService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    private configService: ConfigService,
  ) {
    super(roleRepository, 'Role');
  }

  async createRole(
    context: RequestContext,
    payload: RoleCreateDto,
  ): Promise<any> {
    const { name } = payload;
    const checkExistedRole = await this.roleRepository.findOneBy({
      name,
    });
    if (checkExistedRole)
      throw new ConflictException('Role has already conflicted');

    let role: any;
    try {
      // Create role in DB
      role = await this.roleRepository.save({
        ...payload,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
    return await this.getRole(context, role.id);
  }

  async updateRole(
    context: RequestContext,
    payload: any,
    id: string,
  ): Promise<RoleDto> {
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) throw new NotFoundException('Role not found');
    if (isEmpty(payload)) throw new BadRequestException('Body is required');

    try {
      await this.roleRepository.save({
        id: role.id,
        ...payload,
      });
    } catch (error) {
      throw new BadRequestException('Update role fail');
    }

    return this.getRole(context, role.id);
  }

  async getRole(_context: RequestContext, id: string): Promise<RoleDto> {
    const data = await this.roleRepository.findOneBy({ id });
    if (!data) throw new NotFoundException('Role not found');
    const roleDto = new RoleDto(data);

    return <RoleDto>omit(roleDto);
  }
}
