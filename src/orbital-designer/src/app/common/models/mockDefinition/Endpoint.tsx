import { Response } from './Response';
import { RequestMatch } from './RequestMatch';

export interface Endpoint {
  verb: string;
  path: string;
  requestMatching: RequestMatch;
}
