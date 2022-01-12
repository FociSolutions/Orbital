import { Metadata, defaultMetadata } from './metadata.model';
import { Scenario, emptyScenario } from './scenario/scenario.model';
import { OpenAPIV2 } from 'openapi-types';
import * as uuid from 'uuid';

/**
 * Model representation of mock definition
 */
export interface MockDefinition {
  id: string;
  metadata: Metadata;
  tokenValidation: boolean;
  host?: string;
  basePath?: string;
  scenarios: Scenario[];
  openApi: OpenAPIV2.Document;
}

export const defaultMockDefinition: MockDefinition = {
  id: uuid.v4(),
  metadata: defaultMetadata,
  tokenValidation: false,
  host: '',
  basePath: '',
  scenarios: [emptyScenario],
  openApi: {
    info: { title: '', version: '' },
    paths: {},
    swagger: '',
  },
};
