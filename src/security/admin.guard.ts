import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { User } from "../entities/user.entity";

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<{
      user?: User & { jwtPayload?: { adminContext?: boolean } };
    }>();
    const user = request.user;

    if (
      user &&
      user.role === "ADMIN" &&
      user.jwtPayload?.adminContext === true
    ) {
      return true;
    }

    throw new ForbiddenException(
      "Acesso restrito para administradores ou sessão inválida.",
    );
  }
}
