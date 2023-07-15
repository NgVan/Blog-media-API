/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';
import { PermissionTypes } from 'src/utils/enum';

export const PERMISSION_KEY = 'permissions';
export const Permissions = (...permission: PermissionTypes[]) =>
  SetMetadata(PERMISSION_KEY, permission);

export const SELF_KEY = 'self';
export const IsSelf = (isSelf: boolean) => SetMetadata(SELF_KEY, isSelf);
