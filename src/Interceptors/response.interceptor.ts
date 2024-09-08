import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export class CustomResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;
    return next.handle().pipe(
      map((data) => ({
        statusCode,
        message: statusCode >= 400 ? 'Error' : 'Success',
        timestamp: new Date().toISOString(),
        //path: request.url,
        data,
      })),
      catchError((err) => {
        const statusCode = err instanceof HttpException ? err.getStatus() : 500;
        const errorResponse = {
          statusCode,
          message: err.message || 'Internal server error',
          error: err.name || 'Error',
          timestamp: new Date().toISOString(),
          //path: request.url,
          data: {},
        };
        return throwError(() => new HttpException(errorResponse, statusCode));
      }),
    );
  }
}
