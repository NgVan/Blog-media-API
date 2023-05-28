import { Request } from 'express';
import { Logger } from './logger';

export interface AppRequest extends Request {
  user: any;
  correlationId: string;
  logger: Logger;
}
