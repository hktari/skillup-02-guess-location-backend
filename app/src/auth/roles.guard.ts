import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard {
  constructor(private reflector: Reflector) {}

  // const roles = this.reflector.getAllAndMerge<string[]>('roles', [
  //     context.getHandler(),
  //     context.getClass(),
  //   ]);
}
