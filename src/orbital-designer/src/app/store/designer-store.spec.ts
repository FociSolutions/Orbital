import { DesignerStore } from './designer-store';
import * as faker from 'faker';
import { VerbType } from '../models/verb.type';
import { MockDefinition } from '../models/mock-definition/mock-definition.model';
import validOpenApi from '../../test-files/valid-openapi-spec';
import validMockDefinition from '../../test-files/test-mockdefinition-object';
import { Metadata } from '../models/mock-definition/metadata.model';
import { OpenAPIV2 } from 'openapi-types';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { NGXLogger } from 'ngx-logger';
import { TestBed } from '@angular/core/testing';
import { Scenario } from '../models/mock-definition/scenario/scenario.model';
import { BodyRuleType } from 'src/app/models/mock-definition/scenario/body-rule.type';
import * as uuid from 'uuid';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import { OpenApiSpecService } from '../services/openapispecservice/open-api-spec.service';
import { ReadFileService } from '../services/read-file/read-file.service';

describe('DesignerStore', () => {
  let store: DesignerStore;
  let serviceFileReader: ReadFileService;
  const acceptedVerbs = Object.keys(VerbType).map(verb => verb.toLowerCase());

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [LoggerTestingModule] });
    serviceFileReader = TestBed.get(ReadFileService);
    store = new DesignerStore(TestBed.get(NGXLogger));
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

  describe('DesignerStore.selectedEndpoint', () => {
    it('should set the selectedEndpoint', () => {
      const Expected = {
        path: faker.random.words(),
        verb: VerbType.GET,
        spec: null
      };
      store.selectedEndpoint = Expected;
      expect(store.state.selectedEndpoint).toEqual(Expected);
    });
  });

  describe('DesignerStore.selectedScenario', () => {
    it('should set the selectedScenario', () => {
      const mockverb = VerbType.GET;
      const path = faker.random.words();
      const Expected = {
      id: uuid.v4(),
      metadata: {
        title: 'New Scenario',
        description: ''
      },
      verb: mockverb,
      path,
      response: {
        headers: new Map<string, string>(),
        status: 0,
        body: ''
      },
      requestMatchRules: {
        headerRules: new Map<string, string>(),
        queryRules: new Map<string, string>(),
        bodyRules: [
          {
            type: BodyRuleType.BodyEquality,
            rule: {}
          }
        ] as Array<BodyRule>
      }
    } as Scenario;
      store.selectedScenario = Expected;
      expect(store.state.selectedScenario).toEqual(Expected);
    });
  });

  describe('DesignerStore.setEndpoints()', () => {
    it('should update the state with new endpoints', () => {
      const Expected: MockDefinition = {
        ...validMockDefinition
      };
      expect(store.state.endpoints).toEqual([]);
      store.setEndpoints(Expected.openApi);

      for (const path of Object.keys(Expected.openApi.paths)) {
        for (const verb of acceptedVerbs) {
          if (!!Expected.openApi.paths[path][verb]) {
            expect(
              store.state.endpoints.findIndex(
                endpoint =>
                  endpoint.path === path &&
                  endpoint.verb === VerbType[verb.toUpperCase()] &&
                  endpoint.spec === Expected.openApi.paths[path][verb]
              )
            ).toBeGreaterThan(-1);
          }
        }
      }
    });

    it('should update the state with new endpoints without clearing old ones', done => {
      const service = new OpenApiSpecService();
      const petStore = new File([validOpenApi], 'test.yml');
      const originalEndpoint = {
        path: '/original-pets',
        verb: VerbType.GET,
        spec: null
      };
      serviceFileReader.read(petStore).subscribe({
        next: fileread => {
          service.readOpenApiSpec(fileread).subscribe({
            next: n => {
            store.setEndpoints(n, false);
            for (const path of Object.keys(n.paths)) {
              for (const verb of acceptedVerbs) {
                if (!!n.paths[path][verb]) {
                  expect(
                    store.state.endpoints.findIndex(
                      endpoint =>
                        endpoint.path === path &&
                        endpoint.verb === VerbType[verb.toUpperCase()] &&
                        endpoint.spec === n.paths[path][verb]
                    )
                  ).toBeGreaterThan(-1);
                }
              }
            }
            expect(
              store.state.endpoints.findIndex(e => e === originalEndpoint)
            ).toBeGreaterThan(-1);
            done();
          }});
        }
      });

      store.setState({ ...store.state, endpoints: [originalEndpoint] });
      expect(store.state.endpoints).toEqual([originalEndpoint]);

    });
  });

  describe('DesignerStore.mockDefinition', () => {
    it('should update the state with the new MockDefinition and endpoints', () => {
      const Expected: MockDefinition = {
        ...validMockDefinition
      };
      store.mockDefinition = { ...Expected };
      expect(store.state.mockDefinition).toEqual(Expected);
      for (const path of Object.keys(Expected.openApi.paths)) {
        for (const verb of acceptedVerbs) {
          if (!!Expected.openApi.paths[path][verb]) {
            expect(
              store.state.endpoints.findIndex(
                endpoint =>
                  endpoint.path === path &&
                  endpoint.verb === VerbType[verb.toUpperCase()] &&
                  endpoint.spec === Expected.openApi.paths[path][verb]
              )
            ).toBeGreaterThan(-1);
          }
        }
      }
    });
  });

  describe('DesignerStore.mockDefinitions', () => {
    it('should update the list of MockDefinitions', () => {
      const mockDef = validMockDefinition;
      const expectedMap = new Map([[mockDef.metadata.title, mockDef]]);
      expect(store.state.mockDefinitions.size).toBe(0);
      store.mockDefinitions = [mockDef];
      expect(store.state.mockDefinitions).toEqual(expectedMap);
    });

    it('should set the mockDefinition property of the state to be the first mock definition in the list', () => {
      const mockDef = validMockDefinition;
      expect(store.state.mockDefinitions.size).toBe(0);
      store.mockDefinitions = [mockDef];
      expect(store.state.mockDefinition).toEqual(mockDef);
    });
  });

  describe('DesignerStore.updateMetadata()', () => {
    it('should update MetaData', () => {
      const newMetaData: Metadata = {
        title: faker.random.word(),
        description: faker.random.words()
      };
      store.updateMetadata(newMetaData);
      expect(store.state.mockDefinition.metadata).toEqual(newMetaData);
    });
  });

  describe('DesignerStore.updateApiInformation()', () => {
    it('should update openApi, host, and basepath', () => {
      const fakeDocument = { basePath: '', host: '' } as OpenAPIV2.Document;
      const apiInfo = {
        host: faker.internet.domainName(),
        basepath: faker.internet.domainSuffix(),
        openApi: fakeDocument
      };
      store.updateApiInformation(
        apiInfo.host,
        apiInfo.basepath,
        apiInfo.openApi
      );
      expect(store.state.mockDefinition.host).toEqual(apiInfo.host);
      expect(store.state.mockDefinition.basePath).toEqual(apiInfo.basepath);
      expect(store.state.mockDefinition.openApi).toEqual(apiInfo.openApi);
    });
  });

  describe('DesignerStore.updateScenarios()', () => {
    it('should update scenarios', () => {
      store.mockDefinition = validMockDefinition;
      const scenarios: Scenario[] = [];
      for (let i = 0; i < 10; i++) {
        const mockverb = VerbType.GET;
        const path = 'pets';
        scenarios.push(
          {
          id: uuid.v4(),
          metadata: {
            title: 'New Scenario',
            description: ''
          },
          verb: mockverb,
          path,
          response: {
            headers: new Map<string, string>(),
            status: 0,
            body: ''
          },
          requestMatchRules: {
            headerRules: new Map<string, string>(),
            queryRules: new Map<string, string>(),
            bodyRules: [
              {
                type: BodyRuleType.BodyEquality,
                rule: {}
              }
            ] as Array<BodyRule>
          }
        }  as Scenario);
      }
      store.updateScenarios(scenarios);
      expect(store.state.mockDefinition.scenarios).toEqual(scenarios);
    });
  });

  describe('addOrUpdateScenario', () => {
    it('should add new scenario', () => {
      const mockverb = VerbType.GET;
      const path = faker.random.words();
      const input = {
        mock: validMockDefinition,
        scenario: {
          id: uuid.v4(),
          metadata: {
            title: 'New Scenario',
            description: ''
          },
          verb: mockverb,
          path,
          response: {
            headers: new Map<string, string>(),
            status: 0,
            body: ''
          },
          requestMatchRules: {
            headerRules: new Map<string, string>(),
            queryRules: new Map<string, string>(),
            bodyRules: [
              {
                type: BodyRuleType.BodyEquality,
                rule: {}
              }
            ] as Array<BodyRule>
          }
        } as Scenario
      };
      const expected = input.mock.scenarios.length + 1;

      store.state.mockDefinition = input.mock;
      store.addOrUpdateScenario(input.scenario);
      expect(store.state.mockDefinition.scenarios.length).toEqual(expected);
    });

    it('should update existing scenario', () => {
      const input = {
        mock: validMockDefinition
      };
      const inputScenario = input.mock.scenarios[0];
      const expected = input.mock.scenarios.length;

      store.state.mockDefinition = input.mock;
      store.addOrUpdateScenario(inputScenario);
      expect(store.state.mockDefinition.scenarios.length).toEqual(expected);
    });
  });
});
