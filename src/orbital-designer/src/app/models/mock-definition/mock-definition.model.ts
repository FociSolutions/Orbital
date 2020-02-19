import { Metadata, defaultMetadata } from './metadata.model';
import { Scenario, defaultScenario } from './scenario/scenario.model';
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

export const defaultMockDefinition: MockDefinition = {
  metadata: defaultMetadata,
  host: '',
  basePath: '',
  scenarios: [defaultScenario],
  openApi: {} as OpenAPIV2.Document
};
