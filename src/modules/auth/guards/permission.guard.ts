/* eslint-disable prettier/prettier */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionTypes } from 'src/utils/enum';
import { PERMISSION_KEY } from './list.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requestContext = context.switchToHttp().getRequest() || {};
    const { user } = requestContext;
    const requiredPerms = this.reflector.getAllAndOverride<PermissionTypes[]>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );
    console.log({ requiredPerms, user });

    if (user.permission.includes(PermissionTypes.FLATFORM_ADMIN)) return true;
    if (!requiredPerms) return true;
    return requiredPerms.some((per) => user.permission?.includes(per));
  }
}
