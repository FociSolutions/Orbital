import { DesignerStore } from './designer-store';
import { faker } from '@faker-js/faker';
import { VerbType } from '../models/verb-type';
import { MockDefinition } from '../models/mock-definition/mock-definition.model';
import validOpenApi from '../../test-files/valid-openapi-spec';
import validMockDefinition from '../../test-files/test-mockdefinition-object';
import { Metadata } from '../models/mock-definition/metadata.model';
import { OpenAPIV2 } from 'openapi-types';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { NGXLogger } from 'ngx-logger';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Scenario } from '../models/mock-definition/scenario/scenario.model';
import * as uuid from 'uuid';
import { OpenApiSpecService } from '../services/openapispecservice/open-api-spec.service';
import { ReadFileService } from '../services/read-file/read-file.service';
import * as _ from 'lodash';
import { take } from 'rxjs/operators';
import { defaultTokenRule } from '../models/mock-definition/scenario/token-rule.model';
import { defaultResponse } from '../models/mock-definition/scenario/response.model';
import { RuleType } from '../models/mock-definition/scenario/rule-type';
import { defaultPolicy } from '../models/mock-definition/scenario/policy.model';
import { Endpoint } from '../models/endpoint.model';

describe('DesignerStore', () => {
  let store: DesignerStore;
  let serviceFileReader: ReadFileService;
  type HttpMethodsKeys = keyof typeof OpenAPIV2.HttpMethods;
  const validVerbTypes: OpenAPIV2.HttpMethods[] = Object.keys(VerbType)
    .map((v) => Number(v))
    .filter((v) => !isNaN(v) && OpenAPIV2.HttpMethods[VerbType[v] as HttpMethodsKeys])
    .map((v) => OpenAPIV2.HttpMethods[VerbType[v] as HttpMethodsKeys]);

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [LoggerTestingModule] });
    serviceFileReader = TestBed.inject(ReadFileService);
    store = new DesignerStore(TestBed.inject(NGXLogger));
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

  describe('DesignerStore.selectedEndpoint', () => {
    it('should set the selectedEndpoint', fakeAsync(() => {
      const Expected: Endpoint = {
        path: faker.random.words(),
        verb: VerbType.GET,
        spec: {} as OpenAPIV2.OperationObject,
      };
      store.selectedEndpoint = Expected;
      tick();
      expect(store.state.selectedEndpoint).toEqual(Expected);
    }));
  });

  describe('DesignerStore.selectedScenario', () => {
    it('should set the selectedScenario', fakeAsync(() => {
      const verb = VerbType.GET;
      const path = faker.random.words();
      const Expected: Scenario = {
        id: uuid.v4(),
        metadata: {
          title: 'New Scenario',
          description: '',
        },
        verb,
        path,
        response: defaultResponse,
        requestMatchRules: {
          headerRules: [],
          queryRules: [],
          urlRules: [],
          bodyRules: [
            {
              type: RuleType.JSONEQUALITY,
              value: '{}',
            },
          ],
        },
        policies: [],
        tokenRule: defaultTokenRule,
        defaultScenario: false,
      };
      store.selectedScenario = Expected;
      tick();
      expect(store.state.selectedScenario).toEqual(Expected);
    }));
  });

  describe('DesignerStore.setEndpoints()', () => {
    it('should update the state with new endpoints', () => {
      const Expected: MockDefinition = {
        ...validMockDefinition,
      };
      expect(store.state.endpoints).toEqual([]);
      store.setEndpoints(Expected.openApi);

      for (const path of Object.keys(Expected.openApi.paths)) {
        for (const verb of validVerbTypes) {
          if (Expected.openApi.paths[path][verb]) {
            expect(
              store.state.endpoints.findIndex(
                (endpoint) =>
                  endpoint.path === path &&
                  endpoint.verb === VerbType[verb.toUpperCase() as keyof typeof VerbType] &&
                  endpoint.spec === Expected.openApi.paths[path][verb]
              )
            ).toBeGreaterThan(-1);
          }
        }
      }
    });

    it('should update the state with new endpoints without clearing old ones', (done) => {
      const service = new OpenApiSpecService();
      const petStore = new File([validOpenApi], 'test.yml');
      const originalEndpoint: Endpoint = {
        path: '/original-pets',
        verb: VerbType.GET,
        spec: {} as OpenAPIV2.OperationObject,
      };
      serviceFileReader.read(petStore).subscribe({
        next: (fileRead) => {
          service.readOpenApiSpec(fileRead).subscribe({
            next: (n) => {
              store.setEndpoints(n, false);
              for (const path of Object.keys(n.paths)) {
                for (const verb of validVerbTypes) {
                  if (n.paths[path][verb]) {
                    expect(
                      store.state.endpoints.findIndex(
                        (endpoint) =>
                          endpoint.path === path &&
                          endpoint.verb === VerbType[verb.toUpperCase() as keyof typeof VerbType] &&
                          endpoint.spec === n.paths[path][verb]
                      )
                    ).toBeGreaterThan(-1);
                  }
                }
              }
              expect(store.state.endpoints.findIndex((e) => e === originalEndpoint)).toBeGreaterThan(-1);
              done();
            },
          });
        },
      });

      store.setState({ ...store.state, endpoints: [originalEndpoint] });
      expect(store.state.endpoints).toEqual([originalEndpoint]);
    });
  });

  describe('DesignerStore.mockDefinition', () => {
    it('should update the state with the new MockDefinition and endpoints', fakeAsync(() => {
      const Expected: MockDefinition = {
        ...validMockDefinition,
      };
      store.mockDefinition = { ...Expected };
      tick();
      expect(store.state.mockDefinition).toEqual(Expected);
      for (const path of Object.keys(Expected.openApi.paths)) {
        for (const verb of validVerbTypes) {
          if (Expected.openApi.paths[path]?.[verb as OpenAPIV2.HttpMethods]) {
            expect(
              store.state.endpoints.findIndex(
                (endpoint) =>
                  endpoint.path === path &&
                  endpoint.verb === VerbType[verb.toUpperCase() as keyof typeof VerbType] &&
                  endpoint.spec === Expected.openApi.paths[path][verb as OpenAPIV2.HttpMethods]
              )
            ).toBeGreaterThan(-1);
          }
        }
      }
    }));
  });

  describe('DesignerStore.mockDefinitions', () => {
    it('should update the list of Mockdefinitions', () => {
      const mockDef = validMockDefinition;
      const expectedMap: Record<string, MockDefinition> = {};
      expectedMap[mockDef.metadata.title] = mockDef;
      expect(Object.keys(store.state.mockDefinitions).length).toBe(0);
      store.mockDefinitions = [mockDef];
      expect(store.state.mockDefinitions).toEqual(expectedMap);
    });

    it('should set the mockDefinition property of the state to be the first mock definition in the list', () => {
      const mockDef = validMockDefinition;
      expect(Object.keys(store.state.mockDefinitions).length).toBe(0);
      store.mockDefinitions = [mockDef];
      expect(store.state.mockDefinition).toEqual(mockDef);
    });
  });

  describe('DesignerStore.updateMetadata()', () => {
    it('should update MetaData', fakeAsync(() => {
      const newMetaData: Metadata = {
        title: faker.random.word(),
        description: faker.random.words(),
      };
      store.updateMetadata(newMetaData);
      tick();
      expect(store.state.mockDefinition.metadata).toEqual(newMetaData);
    }));
  });

  describe('DesignerStore.updateApiInformation()', () => {
    it('should update openApi, host, and basePath', fakeAsync(() => {
      const fakeDocument: OpenAPIV2.Document = {
        basePath: '',
        host: '',
        info: {} as OpenAPIV2.InfoObject,
        paths: {} as OpenAPIV2.PathsObject,
        swagger: '',
      };
      const apiInfo = {
        host: faker.internet.domainName(),
        basePath: faker.internet.domainSuffix(),
        openApi: fakeDocument,
      };
      store.updateApiInformation(apiInfo.host, apiInfo.basePath, apiInfo.openApi);
      tick();
      expect(store.state.mockDefinition.host).toEqual(apiInfo.host);
      expect(store.state.mockDefinition.basePath).toEqual(apiInfo.basePath);
      expect(store.state.mockDefinition.openApi).toEqual(apiInfo.openApi);
    }));
  });

  describe('DesignerStore.updateScenarios()', () => {
    it('should update scenarios', fakeAsync(() => {
      store.mockDefinition = validMockDefinition;
      const scenarios: Scenario[] = [];
      for (let i = 0; i < 10; i++) {
        const verb = VerbType.GET;
        const path = 'pets';
        scenarios.push({
          id: uuid.v4(),
          metadata: {
            title: 'New Scenario',
            description: '',
          },
          verb,
          policies: [defaultPolicy],
          tokenRule: defaultTokenRule,
          path,
          response: defaultResponse,
          requestMatchRules: {
            headerRules: [],
            queryRules: [],
            urlRules: [],
            bodyRules: [
              {
                type: RuleType.JSONEQUALITY,
                value: '{}',
              },
            ],
          },
          defaultScenario: false,
        });
      }
      tick();
      store.updateScenarios(scenarios);
      tick();
      expect(store.state.mockDefinition.scenarios).toEqual(scenarios);
    }));
  });

  describe('DesignerStore.deleteMockDefinitionByTitle()', () => {
    it('should delete a mock definition by title if it exists in the store', fakeAsync(() => {
      const mockDef = _.cloneDeep(validMockDefinition);
      store.appendMockDefinition(mockDef);
      store.deleteMockDefinitionByTitle(mockDef.metadata.title);
      tick();
      expect(Object.keys(store.state.mockDefinitions).length).toBe(0);
    }));

    it('should delete only a single mock definition by title if only one matches in the store', fakeAsync(() => {
      const mockDef1 = validMockDefinition;
      const mockDef2 = _.cloneDeep(validMockDefinition);
      mockDef2.metadata.title = faker.random.word();
      store.mockDefinitions = [mockDef1, mockDef2];
      store.deleteMockDefinitionByTitle(mockDef2.metadata.title);
      tick();
      expect(Object.keys(store.state.mockDefinitions).length).toBe(1);
    }));

    it('should not delete a mock definition by title if there are none in the store', fakeAsync(() => {
      store.state.mockDefinitions = {};
      store.deleteMockDefinitionByTitle('Invalid');
      tick();
      expect(Object.keys(store.state.mockDefinitions).length).toBe(0);
      expect(store.state.mockDefinition).toEqual(null);
    }));

    it('should not delete a mock definition by title if it does not exist in the store', fakeAsync(() => {
      const mockDef = validMockDefinition;
      store.mockDefinitions = [mockDef];
      store.deleteMockDefinitionByTitle('Invalid');
      tick();
      expect(Object.keys(store.state.mockDefinitions).length).toBe(1);
      expect(store.state.mockDefinition).toEqual(mockDef);
    }));

    it('should delete the state when the state is changed by deleting a single mock definition', fakeAsync(() => {
      const mockDef = _.cloneDeep(validMockDefinition);
      store.appendMockDefinition(mockDef);
      store.deleteMockDefinitionByTitle(mockDef.metadata.title);
      tick();
      expect(Object.keys(store.state.mockDefinitions).length).toBe(0);
    }));

    it('should delete a single mock definition when multiple exist', fakeAsync(() => {
      const mockDef1 = _.cloneDeep(validMockDefinition);
      const mockDef2 = _.cloneDeep(validMockDefinition);
      const mockDef3 = _.cloneDeep(validMockDefinition);

      mockDef1.metadata.title = faker.random.words(4);
      mockDef2.metadata.title = faker.random.words(4);
      mockDef3.metadata.title = faker.random.words(4);

      store.appendMockDefinition(mockDef1);
      store.appendMockDefinition(mockDef2);
      store.appendMockDefinition(mockDef3);

      store.deleteMockDefinitionByTitle(mockDef1.metadata.title);

      const expected: Record<string, MockDefinition> = {};
      expected[mockDef2.metadata.title] = mockDef2;
      expected[mockDef3.metadata.title] = mockDef3;
      tick();
      expect(store.state.mockDefinitions).toEqual(expected);
    }));
  });

  describe('DesignerStore.appendMockDefinition()', () => {
    it('should append a mock definition to the store if the store is empty', fakeAsync(() => {
      store.state.mockDefinitions = {};
      store.appendMockDefinition(validMockDefinition);
      tick();
      expect(Object.keys(store.state.mockDefinitions).length).toBe(1);
      expect(store.state.mockDefinition).toEqual(validMockDefinition);
    }));

    it('should append a mock definition to the store if the store contains other mock definitions', fakeAsync(() => {
      const mockDef1 = validMockDefinition;
      const mockDef2 = _.cloneDeep(validMockDefinition);
      mockDef2.metadata.title = faker.random.word();
      store.mockDefinitions = [mockDef1];
      store.appendMockDefinition(mockDef2);
      tick();
      expect(Object.keys(store.state.mockDefinitions).length).toBe(2);
    }));

    it('should overwrite a mock definition to the store if the store contains other mock definitions when appending', fakeAsync(() => {
      const mockDef1 = validMockDefinition;
      const mockDef2 = _.cloneDeep(validMockDefinition);
      store.mockDefinitions = [mockDef1];
      store.appendMockDefinition(mockDef2);
      tick();
      expect(Object.keys(store.state.mockDefinitions).length).toBe(1);
    }));

    it('should set the endpoints when appending a single mock definition to a list of none', (done) => {
      const mockDef = _.cloneDeep(validMockDefinition);
      store.appendMockDefinition(mockDef);

      store.state$.subscribe({
        next: (state) => {
          // checks if any state's endpoints is not empty (as events are emitted beforehand for mock definition updates)
          // this will fail if all states have empty endpoints (good) as done will timeout in 5000ms
          if (state.endpoints.length !== 0) {
            expect(state.endpoints).not.toEqual([]);
          }
          done();
        },
        complete: () => done(),
        error: (err) => done.fail(err),
      });
    });

    it('should update the state subscription when the state is changed by appending a single mock definition', (done) => {
      const mockDef = _.cloneDeep(validMockDefinition);
      store.appendMockDefinition(mockDef);
      store.state$.subscribe({
        next: (state) => {
          if (state.mockDefinition) {
            expect(state.mockDefinition).toEqual(mockDef);
          }
          done();
        },
        complete: () => done(),
        error: (err) => done.fail(err),
      });
    });

    it('should update the state subscription when the state is changed when appending', (done) => {
      const mockDef1 = _.cloneDeep(validMockDefinition);
      const mockDef2 = _.cloneDeep(validMockDefinition);
      const mockDef3 = _.cloneDeep(validMockDefinition);

      mockDef1.metadata.title = faker.random.words(3);
      mockDef2.metadata.title = faker.random.words(3);
      mockDef3.metadata.title = faker.random.words(3);

      store.appendMockDefinition(mockDef1);
      store.appendMockDefinition(mockDef2);
      store.appendMockDefinition(mockDef3);

      store.state$.subscribe({
        next: (state) => {
          if (state.mockDefinition) {
            expect(state.mockDefinition).toEqual(mockDef1);
          }
          done();
        },
        complete: () => done(),
        error: (err) => done.fail(err),
      });

      // remove one item from the store to simulate queuing
      store.state$.pipe(take(1));
    });

    it('should update the state subscription when the state is changed when appending, and an item already exists with the same name', (done) => {
      const mockDef1 = _.cloneDeep(validMockDefinition);
      const mockDef2 = _.cloneDeep(validMockDefinition);

      mockDef1.metadata.title = faker.random.word();
      mockDef2.metadata.title = mockDef1.metadata.title;
      mockDef2.scenarios = [{ id: faker.random.word() } as Scenario];

      let calls = 0;
      store.state$.subscribe((state) => {
        if (state.mockDefinition) {
          if (calls === 1) {
            expect(state.mockDefinition).toEqual(mockDef1);
            done();
          }

          calls++;
        }
      });

      store.appendMockDefinition(mockDef1);
      store.appendMockDefinition(mockDef2);
    });
  });

  describe('addOrUpdateScenario', () => {
    it('should add new scenario', fakeAsync(() => {
      const verb = VerbType.GET;
      const path = faker.random.words();
      const scenario: Scenario = {
        id: uuid.v4(),
        metadata: {
          title: 'New Scenario',
          description: '',
        },
        verb,
        path,
        response: defaultResponse,
        policies: [defaultPolicy],
        tokenRule: defaultTokenRule,
        requestMatchRules: {
          urlRules: [],
          headerRules: [],
          queryRules: [],
          bodyRules: [
            {
              type: RuleType.JSONEQUALITY,
              value: '{}',
            },
          ],
        },
        defaultScenario: false,
      };
      const expected = validMockDefinition.scenarios.length + 1;

      store.state.mockDefinition = validMockDefinition;
      store.addOrUpdateScenario(scenario);
      tick();
      expect(store.state.mockDefinition.scenarios.length).toEqual(expected);
    }));

    it('should update existing scenario', fakeAsync(() => {
      const input = {
        mock: validMockDefinition,
      };
      const inputScenario = input.mock.scenarios[0];
      const expected = input.mock.scenarios.length;

      store.state.mockDefinition = input.mock;
      store.addOrUpdateScenario(inputScenario);
      tick();
      expect(store.state.mockDefinition.scenarios.length).toEqual(expected);
    }));
  });
});
