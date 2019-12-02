import { VerbType } from '../app/models/verb.type';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';

export default {
  scenarios: [
    {
      id: '72dded1d-3755-4749-9aad-f7b4d769ea57',
      metadata: {
        title: 'Another Scenario',
        description: 'Another test scenario'
      },
      verb: 0,
      path: '/',
      response: {
        headers: new Map<string, string>(),
        status: 404,
        body: ''
      },
      requestMatchRules: {
        bodyRules: [],
        headerRules: new Map<string, string>(),
        queryRules: new Map<string, string>()
      }
    }
  ],
  openApi: {
    swagger: '2.0',
    info: {
      title: 'Simple API overview',
      version: 'v2'
    },
    paths: {
      '/': {
        get: {
          operationId: 'listVersionsv2',
          summary: 'List API versions',
          produces: ['application/json'],
          responses: {
            200: {
              description: '200 300 response'
            },
            300: {
              description: '200 300 response'
            }
          }
        }
      },
      '/v2': {
        get: {
          operationId: 'getVersionDetailsv2',
          summary: 'Show API version details',
          produces: ['application/json'],
          responses: {
            200: {
              description: '200 203 response'
            },
            203: {
              description: '200 203 response'
            }
          }
        }
      }
    },
    consumes: ['application/json']
  },
  metadata: {
    title: 'Test Mock',
    description: 'A Test Mock'
  }
} as MockDefinition;
