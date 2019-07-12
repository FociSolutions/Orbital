import { VerbType } from '../app/models/verb.type';

export default {
  scenarios: [
    {
      id: 'e798eebc-646f-404b-b6b8-bbc6f2ca4ac6',
      metadata: {
        title: 'Scenario 1',
        description: 'Scenario 1 description'
      },
      verb: VerbType.GET,
      path: '/pets',
      response: {
        headers: new Map<string, string>([
          ['Content-Type', 'application/json']
        ]),
        status: 200,
        body: ''
      },
      requestMatchRules: {
        headerRules: new Map<string, string>([
          ['Content-Type', 'application/json']
        ]),
        queryRules: new Map<string, string>([]),
        bodyRules: [
          {
            type: 3,
            rule: ''
          }
        ]
      }
    },
    {
      id: 'f1cd8240-5d73-488e-a851-d4cad0f4219c',
      metadata: {
        title: 'Scenario 2',
        description: 'Scenario 2 description'
      },
      verb: VerbType.POST,
      path: '/pets',
      response: {
        headers: new Map<string, string>([
          ['Content-Type', 'application/json']
        ]),
        status: 404,
        body: ''
      },
      requestMatchRules: {
        headerRules: new Map<string, string>([
          ['Content-Type', 'application/json']
        ]),
        queryRules: new Map<string, string>([]),
        bodyRules: [
          {
            type: 3,
            rule: ''
          }
        ]
      }
    }
  ],
  host: 'petstore.swagger.io',
  basePath: '/api',
  openApi: {
    swagger: '2.0',
    info: {
      version: '1.0.0',
      title: 'Swagger Petstore',
      description:
        'A sample API that uses a petstore as an example to demonstrate features in the swagger-2.0 specification',
      termsOfService: 'http://swagger.io/terms/',
      contact: {
        name: 'Swagger API Team'
      },
      license: {
        name: 'MIT'
      }
    },
    host: 'petstore.swagger.io',
    basePath: '/api',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    paths: {
      '/pets': {
        get: {
          description:
            'Returns all pets from the system that the user has access to',
          operationId: 'findPets',
          produces: [
            'application/json',
            'application/xml',
            'text/xml',
            'text/html'
          ],
          parameters: [
            {
              name: 'tags',
              in: 'query',
              description: 'tags to filter by',
              required: false,
              type: 'array',
              items: {
                type: 'string'
              },
              collectionFormat: 'csv'
            },
            {
              name: 'limit',
              in: 'query',
              description: 'maximum number of results to return',
              required: false,
              type: 'integer',
              format: 'int32'
            }
          ],
          responses: {
            200: {
              description: 'pet response',
              schema: {
                type: 'array',
                items: {
                  $ref: '#/definitions/Pet'
                }
              }
            },
            default: {
              description: 'unexpected error',
              schema: {
                $ref: '#/definitions/ErrorModel'
              }
            }
          }
        },
        post: {
          description:
            'Creates a new pet in the store.  Duplicates are allowed',
          operationId: 'addPet',
          produces: ['application/json'],
          parameters: [
            {
              name: 'pet',
              in: 'body',
              description: 'Pet to add to the store',
              required: true,
              schema: {
                $ref: '#/definitions/NewPet'
              }
            }
          ],
          responses: {
            200: {
              description: 'pet response',
              schema: {
                $ref: '#/definitions/Pet'
              }
            },
            default: {
              description: 'unexpected error',
              schema: {
                $ref: '#/definitions/ErrorModel'
              }
            }
          }
        }
      },
      '/pets/{id}': {
        get: {
          description:
            'Returns a user based on a single ID, if the user does not have access to the pet',
          operationId: 'findPetById',
          produces: [
            'application/json',
            'application/xml',
            'text/xml',
            'text/html'
          ],
          parameters: [
            {
              name: 'id',
              in: 'path',
              description: 'ID of pet to fetch',
              required: true,
              type: 'integer',
              format: 'int64'
            }
          ],
          responses: {
            200: {
              description: 'pet response',
              schema: {
                $ref: '#/definitions/Pet'
              }
            },
            default: {
              description: 'unexpected error',
              schema: {
                $ref: '#/definitions/ErrorModel'
              }
            }
          }
        },
        delete: {
          description: 'deletes a single pet based on the ID supplied',
          operationId: 'deletePet',
          parameters: [
            {
              name: 'id',
              in: 'path',
              description: 'ID of pet to delete',
              required: true,
              type: 'integer',
              format: 'int64'
            }
          ],
          responses: {
            204: {
              description: 'pet deleted'
            },
            default: {
              description: 'unexpected error',
              schema: {
                $ref: '#/definitions/ErrorModel'
              }
            }
          }
        }
      }
    },
    definitions: {
      Pet: {
        type: 'object',
        allOf: [
          {
            $ref: '#/definitions/NewPet'
          },
          {
            required: ['id'],
            properties: {
              id: {
                type: 'integer',
                format: 'int64'
              }
            }
          }
        ]
      },
      NewPet: {
        type: 'object',
        required: ['name'],
        properties: {
          name: {
            type: 'string'
          },
          tag: {
            type: 'string'
          }
        }
      },
      ErrorModel: {
        type: 'object',
        required: ['code', 'message'],
        properties: {
          code: {
            type: 'integer',
            format: 'int32'
          },
          message: {
            type: 'string'
          }
        }
      }
    }
  },
  metadata: {
    title: 'test',
    description: ''
  }
};
