import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data: unknown) => {
        // Se a resposta já for encapsulada com { data: ... }, evitamos duplicar
        if (
          data &&
          typeof data === "object" &&
          "data" in data &&
          Object.keys(data).length === 1
        ) {
          return data as Response<T>;
        }
        return { data: data as T };
      }),
    );
  }
}
