import { Metadata } from './metadata.model';
import { Scenario } from './scenario/scenario.model';
import { OpenAPIV2 } from 'openapi-types';

/**
 * Model representation of mock definition
 */
export interface MockDefinition {
  metadata: Metadata;
  host?: string;
  basePath?: string;
  scenarios: Scenario[];
  openApi: OpenAPIV2.Document;

}
