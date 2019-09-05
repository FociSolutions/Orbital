import { DesignerStore } from './designer-store';
import * as faker from 'faker';
import { VerbType } from '../models/verb.type';
import {
  newScenario,
  Scenario
} from '../models/mock-definition/scenario/scenario.model';
import { MockDefinition } from '../models/mock-definition/mock-definition.model';
import validOpenApi from '../../test-files/valid-openapi-spec';
import validMockDefinition from '../../test-files/test-mockdefinition-object';
import { Metadata } from '../models/mock-definition/metadata.model';
import { OpenAPIV2 } from 'openapi-types';

describe('DesignerStore', () => {
  let store: DesignerStore;
  beforeEach(() => {
    store = new DesignerStore();
  });

  it('should create an instance', () => {
    expect(new DesignerStore()).toBeTruthy();
  });

  describe('set selectedEndpoint', () => {
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

  describe('set selectedScenario', () => {
    it('should set the selectedScenario', () => {
      const Expected = newScenario(VerbType.GET, faker.random.words());
      store.selectedScenario = Expected;
      expect(store.state.selectedScenario).toEqual(Expected);
    });
  });

  describe('setEndpoints', () => {
    it('should update the state with new endpoints', done => {
      const petStore = validOpenApi;
      const acceptedVerbs = Object.keys(VerbType).map(verb =>
        verb.toLowerCase()
      );
      expect(store.state.endpoints).toEqual([]);
      MockDefinition.toOpenApiSpec(petStore).then(doc => {
        store.setEndpoints(doc);
        for (const path of Object.keys(doc.paths)) {
          for (const verb of acceptedVerbs) {
            if (!!doc.paths[path][verb]) {
              expect(
                store.state.endpoints.findIndex(
                  endpoint =>
                    endpoint.path === path &&
                    endpoint.verb === VerbType[verb.toUpperCase()] &&
                    endpoint.spec === doc.paths[path][verb]
                )
              ).toBeGreaterThan(-1);
            }
          }
        }
        done();
      });
    });

    describe('setMockDefinition', () => {
      it('should update the state with the new MockDefinition', () => {
        const Expected: MockDefinition = {
          ...validMockDefinition
        };
        store.mockDefinition = { ...Expected };
        expect(store.state.mockDefinition).toEqual(Expected);
      });
    });

    it('should update the state with new endpoints without clearing old ones', done => {
      const petStore = validOpenApi;
      const originalEndpoint = {
        path: '/original-pets',
        verb: VerbType.GET,
        spec: null
      };
      store.setState({ ...store.state, endpoints: [originalEndpoint] });
      const acceptedVerbs = Object.keys(VerbType).map(verb =>
        verb.toLowerCase()
      );
      expect(store.state.endpoints).toEqual([originalEndpoint]);
      MockDefinition.toOpenApiSpec(petStore).then(doc => {
        store.setEndpoints(doc, false);
        for (const path of Object.keys(doc.paths)) {
          for (const verb of acceptedVerbs) {
            if (!!doc.paths[path][verb]) {
              expect(
                store.state.endpoints.findIndex(
                  endpoint =>
                    endpoint.path === path &&
                    endpoint.verb === VerbType[verb.toUpperCase()] &&
                    endpoint.spec === doc.paths[path][verb]
                )
              ).toBeGreaterThan(-1);
            }
          }
        }
        expect(
          store.state.endpoints.findIndex(e => e === originalEndpoint)
        ).toBeGreaterThan(-1);
        done();
      });
    });
  });

  describe('updateMetadata', () => {
    it('should update MetaData', () => {
      const newMetaData: Metadata = {
        title: faker.random.word(),
        description: faker.random.words()
      };
      store.updateMetadata(newMetaData);
      expect(store.state.mockDefinition.metadata).toEqual(newMetaData);
    });
  });

  describe('updateApiInformation', () => {
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

  describe('updateScenarios', () => {
    it('should update scenarios', () => {
      const scenarios: Scenario[] = [];
      for (let i = 0; i < 10; i++) {
        scenarios.push(newScenario(VerbType.GET, '/pets'));
      }
      store.updateScenarios(scenarios);
      expect(store.state.mockDefinition.scenarios).toEqual(scenarios);
    });
  });
});
