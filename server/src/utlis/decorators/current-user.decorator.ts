import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (key: keyof User, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();

    const user = request.user as User;
    return key ? user[key] : user;
  },
);
