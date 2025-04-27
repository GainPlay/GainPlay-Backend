import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { AuthReflectors } from "@/auth/interfaces";
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";

@Injectable()
export class GlobalAuthGuard extends AuthGuard(["jwt", "google"]) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      AuthReflectors.IS_PUBLIC,
      [context.getHandler(), context.getClass()],
    );

    return isPublic || super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
