import { AuthReflectors } from "@/auth/interfaces";
import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from "@nestjs/common";

export const Public = () => SetMetadata(AuthReflectors.IS_PUBLIC, true);

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
