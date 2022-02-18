import { OpenAPIV2 } from 'openapi-types';
import { VerbType } from './verb-type';

/**
 * Model representation of an endpoint
 */
export interface Endpoint {
  path: string;
  verb: VerbType;
  spec: OpenAPIV2.OperationObject;
}
