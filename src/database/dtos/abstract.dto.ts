import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { v4 as uuid } from 'uuid';

export class AbstractDto {
  constructor(entity = <AbstractDto>{}) {
    this.id = entity?.id;
    this.created = entity?.created;
    this.modified = entity?.modified;
    this.deleted = entity?.deleted;
  }
  @ApiProperty({ required: false, default: uuid() })
  id: string;

  @ApiProperty({ required: false })
  created?: Date;

  @ApiProperty({ required: false })
  @ApiPropertyOptional()
  modified?: Date;

  @ApiProperty({ required: false })
  deleted?: Date;
}
