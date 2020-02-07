import { TestBed, inject } from '@angular/core/testing';
import { ScenarioEditorService } from './scenario-editor.service';
import { DesignerStore } from 'src/app/store/designer-store';
import { LoggerTestingModule } from 'ngx-logger/testing/';
import * as faker from 'faker';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { KeyValuePairRule } from 'src/app/models/mock-definition/scenario/key-value-pair-rule.model';
import { defaultScenario } from 'src/app/models/mock-definition/scenario/scenario.model';

fdescribe('Service: ScenarioEditor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoggerTestingModule],
      providers: [ScenarioEditorService, DesignerStore]
    });
  });

  beforeEach(() => {
    const designerStore = TestBed.get(DesignerStore) as DesignerStore;
    designerStore.selectedScenario = defaultScenario;
  });

  it('should ...', inject(
    [ScenarioEditorService],
    (service: ScenarioEditorService) => {
      expect(service).toBeTruthy();
    }
  ));

  it('should return an observable for scenario state ', inject(
    [ScenarioEditorService],
    (service: ScenarioEditorService) => {
      expect(service.scenarioOnChange$).toBeTruthy();
    }
  ));

  it('should return an observable for url rules list ', inject(
    [ScenarioEditorService],
    (service: ScenarioEditorService) => {
      expect(service.urlEditRulesOnChange$).toBeTruthy();
    }
  ));

  it('should update url list ', inject(
    [ScenarioEditorService],
    (service: ScenarioEditorService) => {
      const urlList = [
        {
          type: faker.random.number({
            min: 0,
            max: Object.keys(RuleType).length - 1
          }) as RuleType,
          rule: { test: faker.random.word() }
        }
      ] as KeyValuePairRule[];
      service.updateUrlEditRules(urlList);

      service.urlEditRulesOnChange$.subscribe(rules =>
        expect(rules.length).toBe(1)
      );
    }
  ));
});
