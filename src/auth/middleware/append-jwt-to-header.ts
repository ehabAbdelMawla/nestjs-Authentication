import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
/*
    Middleware To Add Jwt From Cookies  To request header 
*/
export class AppendJwtToHeader implements NestMiddleware {
  use(request: Request, res: Response, next: NextFunction) {
    if (
      request?.cookies &&
      request?.cookies?.jwt &&
      request?.cookies?.jwt != 'expiredToken'
    ) {
      request.headers.authorization = `Bearer ${request?.cookies?.jwt}`;
    }
    next();
  }
}
