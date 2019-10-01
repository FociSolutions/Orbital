import { TestBed, async } from '@angular/core/testing';
import { MockDefinitionStore } from './mockdefinitionstore';
import * as faker from 'faker';
import { Metadata } from '../models/mock-definition/metadata.model';
import {
  Scenario,
  newScenario
} from '../models/mock-definition/scenario/scenario.model';
import { VerbType } from '../models/verb.type';
import { MockDefinition } from '../models/mock-definition/mock-definition.model';
import { OpenAPIV2 } from 'openapi-types';

describe('MockDefinition Store', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: []
    }).compileComponents();
  });

  it('should create a new mock definition store', () => {
    const store = new MockDefinitionStore();
    expect(store).toBeDefined();
  });

  it('should update MetaData', () => {
    const newMetaData: Metadata = {
      title: faker.random.word(),
      description: faker.random.words()
    };
    const store = new MockDefinitionStore();
    store.updateMetadata(newMetaData);
    expect(store.state.metadata).toBe(newMetaData);
  });

  it('should update API Information', () => {
    const fakeDocument = { basePath: '', host: '' } as OpenAPIV2.Document;
    const apiInfo = {
      host: faker.internet.domainName(),
      basepath: faker.internet.domainSuffix(),
      openApi: fakeDocument
    };
    const store = new MockDefinitionStore();
    store.updateApiInformation(apiInfo.host, apiInfo.basepath, apiInfo.openApi);
    expect(store.state.host).toBe(apiInfo.host);
    expect(store.state.basePath).toBe(apiInfo.basepath);
    expect(store.state.openApi).toBe(apiInfo.openApi);
  });

  it('should update Scenarios', () => {
    const scenarios: Scenario[] = [];
    for (let i = 0; i < 10; i++) {
      scenarios.push(newScenario(VerbType.GET, '/pets'));
    }
    const store = new MockDefinitionStore();
    store.updateScenarios(scenarios);
    expect(store.state.scenarios).toBe(scenarios);
  });
});
