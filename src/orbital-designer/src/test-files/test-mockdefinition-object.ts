import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { ResponseType } from 'src/app/models/mock-definition/scenario/response-type';
import * as uuid from 'uuid';
import { defaultTokenRule } from 'src/app/models/mock-definition/scenario/token-rule.model';

const validMockDefinition: MockDefinition = {
  scenarios: [
    {
      id: '72dded1d-3755-4749-9aad-f7b4d769ea57',
      metadata: {
        title: 'Another Scenario',
        description: 'Another test scenario',
      },
      verb: 0,
      path: '/',
      response: {
        headers: {},
        status: 404,
        body: '',
        type: ResponseType.CUSTOM,
      },
      requestMatchRules: {
        bodyRules: [],
        headerRules: [],
        queryRules: [],
        urlRules: [
          {
            type: 5,
            path: '/pets/12',
          },
        ],
      },
      policies: [],
      defaultScenario: false,
      tokenRule: defaultTokenRule,
    },
  ],
  openApi: {
    swagger: '2.0',
    info: {
      title: 'Simple API overview',
      version: 'v2',
    },
    paths: {
      '/': {
        get: {
          operationId: 'listVersionsv2',
          summary: 'List API versions',
          produces: ['application/json'],
          responses: {
            200: {
              description: '200 300 response',
            },
            300: {
              description: '200 300 response',
            },
          },
        },
      },
      '/v2': {
        get: {
          operationId: 'getVersionDetailsv2',
          summary: 'Show API version details',
          produces: ['application/json'],
          responses: {
            200: {
              description: '200 203 response',
            },
            203: {
              description: '200 203 response',
            },
          },
        },
      },
    },
    consumes: ['application/json'],
  },
  id: uuid.v4(),
  metadata: {
    title: 'Test Mock',
    description: 'A Test Mock',
  },
  tokenValidation: true,
};

export default validMockDefinition;
