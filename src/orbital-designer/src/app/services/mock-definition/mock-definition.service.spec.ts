import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import * as faker from 'faker';
import * as uuid from 'uuid';
import { MockDefinitionService } from './mock-definition.service';
import validMockDefinition from '../../../test-files/test-mockdefinition-object';
import validMockDefinitionFile from '../../../test-files/test-mockdefinition-file.mock';
import { DesignerStore } from '../../store/designer-store';
import { Scenario, ScenarioParams } from 'src/app/models/mock-definition/scenario/scenario.model';
import { VerbType } from 'src/app/models/verb.type';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { defaultMockDefinition, MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import validOpenApiTest from '../../../test-files/valid-openapi-spec';
import * as yaml from 'js-yaml';
import { OpenAPIV2 } from 'openapi-types';
import * as _ from 'lodash';
import { ResponseType } from 'src/app/models/mock-definition/scenario/response.type';

describe('MockDefinitionService', () => {
  let store: DesignerStore;
  let service: MockDefinitionService;
  let scenarioParams: ScenarioParams;

  const ValidMockDefinitionInst = _.cloneDeep(validMockDefinition);
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [LoggerTestingModule],
      providers: [DesignerStore, MockDefinitionService],
    }).compileComponents();
    store = TestBed.get(DesignerStore);
    service = TestBed.get(MockDefinitionService);
    scenarioParams = service.defaultScenarioParams('/test', VerbType.GET, 200);
    store.mockDefinition = ValidMockDefinitionInst;
    tick();
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should clone a scenario from the store such that no name conflicts will be encountered', (done) => {
    const scenarios = [];
    for (let i = 0; i < 10; i++) {
      let scenario = service.generateNewScenario(scenarioParams);
      scenario.metadata.title = faker.random.words(3);
      scenarios.push(JSON.parse(JSON.stringify(scenario)));
    }
    store.state.mockDefinition.scenarios = scenarios;

    const scenarioToClone = JSON.parse(JSON.stringify(scenarios[0]));
    service.cloneScenario(validMockDefinition.metadata.title, scenarioToClone).subscribe({
      next: () => {
        expect(store.state.mockDefinition.scenarios.find((x) => x.metadata.title.indexOf('-copy') !== -1)).toBeTruthy();
        done();
      },
    });
  });

  it('should clone a scenario from the store such that name conflicts will be encountered and will auto-rename', (done) => {
    const scenarios = [];
    for (let i = 0; i < 10; i++) {
      let scenario = service.generateNewScenario(scenarioParams);

      scenario.metadata.title = faker.random.words(3);
      scenarios.push(JSON.parse(JSON.stringify(scenario)));
    }

    store.state.mockDefinition.scenarios = scenarios;

    const scenarioToClone = JSON.parse(JSON.stringify(scenarios[0]));

    service.cloneScenario(validMockDefinition.metadata.title, scenarioToClone).subscribe({
      complete: () => {
        expect(store.state.mockDefinition.scenarios.filter((x) => x.metadata.title.endsWith('-copy')).length).toBe(1);
        service.cloneScenario(validMockDefinition.metadata.title, scenarioToClone).subscribe({
          complete: () => {
            expect(
              store.state.mockDefinition.scenarios.filter((x) => x.metadata.title.endsWith('-copy 2')).length
            ).toBe(1);
            service.cloneScenario(validMockDefinition.metadata.title, scenarioToClone).subscribe({
              complete: () => {
                expect(
                  store.state.mockDefinition.scenarios.filter((x) => x.metadata.title.endsWith('-copy 3')).length
                ).toBe(1);
                done();
              },
            });
          },
        });
      },
    });
  });

  it('should not clone a scenario from the store if the cloned scenario is invalid', (done) => {
    const scenarios = [];
    for (let i = 0; i < 10; i++) {
      let scenario = service.generateNewScenario(scenarioParams);

      scenario.metadata.title = faker.random.words(3);
      scenarios.push(JSON.parse(JSON.stringify(scenario)));
    }
    store.state.mockDefinition = defaultMockDefinition;
    store.state.mockDefinition.scenarios = scenarios;

    const scenarioLengthComponentExpected = store.state.mockDefinition.scenarios.length;
    const scenarioToClone = null;
    service.cloneScenario(validMockDefinition.metadata.title, scenarioToClone).subscribe({
      next: (hasCloned) => {
        const scenarioLengthComponentActual = store.state.mockDefinition.scenarios.length;
        expect(scenarioLengthComponentActual).toEqual(scenarioLengthComponentExpected);
        expect(hasCloned).toBe(false);
        done();
      },
    });
  });

  describe('When getDefaultValidationScenarios is called', () => {
    it('should not create any default token validation 401 scenarios if one exists already exists in each noted path-verb pair', (done) => {
      const scenarios = [];
      for (let i = 0; i < 3; i++) {
        let scenario = service.generateNewScenario(scenarioParams);

        scenario.metadata.title = faker.random.words(3);
        scenario.response.status = 401;
        scenarios.push(JSON.parse(JSON.stringify(scenario)));
      }

      const tokenValidationScenarios = service.getDefaultValidationScenarios(scenarios);
      expect(tokenValidationScenarios.length).toEqual(0);
      done();
    });

    it('should create the same amount of scenarios (3) as there are scenarios in a path-verb pair that do NOT have a 401 scenario (3)', (done) => {
      const scenarios = [];
      let path: string = '';
      for (let i = 0; i < 3; i++) {
        path += faker.random.words(1) + '/';
        let scenario = service.generateNewScenario(scenarioParams);
        scenario.metadata.title = faker.random.words(3);
        scenario.path = path;
        scenarios.push(JSON.parse(JSON.stringify(scenario)));
      }

      const tokenValidationScenarios = service.getDefaultValidationScenarios(scenarios);
      expect(tokenValidationScenarios.length).toEqual(3);
      done();
    });
  });

  it('should clone a scenario and ensure that the title and id are different', (done) => {
    const scenarios = [];
    for (let i = 0; i < 10; i++) {
      let scenario = service.generateNewScenario(scenarioParams);

      scenario.metadata.title = faker.random.words(3);
      scenarios.push(JSON.parse(JSON.stringify(scenario)));
    }

    store.state.mockDefinition.scenarios = scenarios;
    const scenarioToClone = scenarios[0];
    service.cloneScenario(validMockDefinition.metadata.title, scenarioToClone).subscribe({
      complete: () => {
        expect(store.state.mockDefinition.scenarios[0].id).not.toEqual(store.state.mockDefinition.scenarios[1].id);
        expect(store.state.mockDefinition.scenarios[0].metadata.title).not.toEqual(
          store.state.mockDefinition.scenarios[1].metadata.title
        );
        done();
      },
    });
  });

  it('failed because content is not yaml', (done) => {
    // add invalid Mockdefinition to trigger syntax error
    service.AddMockDefinitionToStore('%').subscribe({
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      },
    });
  });

  it('succeed because content is valid yaml', (done) => {
    service.AddMockDefinitionToStore(validMockDefinitionFile).subscribe({
      next: (t) => {
        expect(t).toBeTruthy();
        done();
      },
    });
  });

  it('validation fails because content is not yaml', (done) => {
    service.validateMockDefinition('%').subscribe({
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      },
    });
  });

  it('validation succeeds because content is valid yaml', (done) => {
    service.validateMockDefinition(validMockDefinitionFile).subscribe({
      next: (t) => {
        expect(t).toBeTruthy();
        done();
      },
    });
  });

  it('should generate default scenarios for imported open api endpoints', () => {
    const content = yaml.load(validOpenApiTest) as OpenAPIV2.Document;
    const scenarios = service.getDefaultScenarios(content.paths);
    expect(scenarios.length).toBe(2);
  });

  describe('backwards compatibility tests', () => {
    let mockDefinitionWithoutResponseType: object;
    let mockDefinitionWithoutResponseTypeJSON: string;

    beforeEach(() => {
      mockDefinitionWithoutResponseType = JSON.parse(_.cloneDeep(validMockDefinitionFile));
      delete mockDefinitionWithoutResponseType['scenarios'][0]['response']['type'];
      mockDefinitionWithoutResponseTypeJSON = JSON.stringify(mockDefinitionWithoutResponseType);
    });

    it('should add a mockdefinition to the store if it does not contain the response type', (done) => {
      service.AddMockDefinitionToStore(mockDefinitionWithoutResponseTypeJSON).subscribe({
        next: (t) => {
          expect(t).toBeTruthy();
          done();
        },
      });
    });

    it('should pass validation if it does not contain a response type', (done) => {
      service.validateMockDefinition(mockDefinitionWithoutResponseTypeJSON).subscribe({
        next: (t) => {
          expect(t).toBeTruthy();
          done();
        },
      });
    });

    it('should automatically add ResponseType.CUSTOM if the response type is not specified', (done) => {
      service.AddMockDefinitionToStore(mockDefinitionWithoutResponseTypeJSON).subscribe({
        next: () => {
          expect(
            store.state.mockDefinition.scenarios.every((scenario) => scenario.response.type === ResponseType.CUSTOM)
          ).toBe(true);
          done();
        },
      });
    });
  });
});
