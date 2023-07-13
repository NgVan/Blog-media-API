/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as httpContext from 'express-http-context';
import onHeaders = require('on-headers');
import { rootLogger } from '../utils/logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
    httpContext.middleware(request, response, () => {
      console.log('Log in LoggerMiddleware: ', request, response);
      const startTime = process.hrtime();

      const correlationId = (
        request.headers['request-id'] ||
        request.headers['x-request-id'] ||
        request.headers['x-correlation-id'] ||
        request.headers.correlationId ||
        uuidv4()
      ).toString();

      const { method, baseUrl, body } = request;
      const url = (baseUrl || '') + (request.url || '-');
      const route = `${method} ${request.route ? request.route.path : url}`;

      const logger = rootLogger.child({
        correlationId,
        route,
        url,
        method,
      });
      onHeaders(response, function onHeaders() {
        const diff = process.hrtime(startTime);
        const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;
        response.setHeader('X-Response-Time', responseTime);
        logger.info(
          {
            responseTime,
            reqBody: body,
            statusCode: response.statusCode,
          },
          'Response',
        );
      });

      //   request.logger = logger;
      //   request.correlationId = correlationId;
      response.setHeader('x-correlation-id', correlationId);
      next();
    });
  }
}
