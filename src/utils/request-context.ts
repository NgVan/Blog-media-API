import { Logger } from './logger';

export interface RequestContext {
  user: any;
  correlationId: string;
  logger: Logger;
}
