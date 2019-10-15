import { VerbType } from '../app/models/verb.type';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';

export default {
  metadata: {
    title: 'PetStore',
    description: ''
  },
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
            '200': {
              description: '200 300 response'
            },
            '300': {
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
            '200': {
              description: '200 203 response'
            },
            '203': {
              description: '200 203 response'
            }
          }
        }
      }
    },
    consumes: ['application/json']
  },
  host: 'petstore.swagger.io',
  basePath: '/v1',
  scenarios: []
} as MockDefinition;
