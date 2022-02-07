import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlEditRuleComponent } from './url-edit-rule.component';
import { SharedModule } from '../../../shared/shared.module';
import { LoggerTestingModule } from 'ngx-logger/testing/';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import * as faker from 'faker';
import { RuleType } from '../../../models/mock-definition/scenario/rule.type';
import { UrlAddRuleComponent } from './url-add-rule/url-add-rule.component';
import { UrlListItemRuleTypeComponent } from './url-list-item-rule-type/url-list-item-rule-type.component';
import { DesignerStore } from 'src/app/store/designer-store';
import { emptyScenario } from 'src/app/models/mock-definition/scenario/scenario.model';
import { ScenarioFormBuilder } from '../scenario-form-builder/scenario-form.builder';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { UrlRule } from 'src/app/models/mock-definition/scenario/url-rule.model';
import { GetRuleTypeStringPipe } from 'src/app/pipes/get-rule-type-string/get-rule-type-string.pipe';

describe('UrlEditRuleComponent', () => {
  let component: UrlEditRuleComponent;
  let fixture: ComponentFixture<UrlEditRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, LoggerTestingModule, BrowserAnimationsModule, MatCardModule],
      declarations: [UrlEditRuleComponent, UrlAddRuleComponent, UrlListItemRuleTypeComponent, GetRuleTypeStringPipe],
      providers: [DesignerStore, ScenarioFormBuilder],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlEditRuleComponent);
    component = fixture.componentInstance;
    const designerStore = TestBed.inject(DesignerStore);
    const scenarioFormBuilder = TestBed.inject(ScenarioFormBuilder);
    designerStore.selectedScenario = emptyScenario;
    const scenarioFormGroup = scenarioFormBuilder.createNewScenarioForm();
    component.urlMatchRuleFormArray = scenarioFormGroup.get('requestMatchRules.urlMatchRules') as FormArray;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('UrlEditRuleComponent.deleteKvpFromRule', () => {
    it('should delete the url rule if it defined', () => {
      const urlRule: UrlRule = {
        type: faker.datatype.number({
          min: 0,
          max: Object.keys(RuleType).length - 1,
        }),
        path: faker.random.word(),
      };
      component.urlMatchRuleFormArray.push(
        new FormGroup({
          path: new FormControl(urlRule.path, [
            Validators.required,
            Validators.maxLength(UrlEditRuleComponent.PATH_MAXLENGTH),
          ]),
          type: new FormControl(urlRule.type, [Validators.required]),
        })
      );
      component.deleteUrlEditRuleHandler(0);
      expect(component.urlMatchRuleFormArray.length).toBe(0);
    });

    it('should delete the url rule by key if there are multiple similar kvps', () => {
      const randomWord = faker.random.word();
      // this has to have the same value for all the values to make sure that it is not deleting by value
      const urlRules: UrlRule[] = [
        {
          type: faker.datatype.number({
            min: 0,
            max: Object.keys(RuleType).length - 1,
          }),
          path: randomWord,
        },
        {
          type: faker.datatype.number({
            min: 0,
            max: Object.keys(RuleType).length - 1,
          }),
          path: randomWord,
        },
        {
          type: faker.datatype.number({
            min: 0,
            max: Object.keys(RuleType).length - 1,
          }),
          path: randomWord,
        },
      ];

      component.urlMatchRuleFormArray.push(
        new FormGroup({
          path: new FormControl(urlRules[0].path, [
            Validators.required,
            Validators.maxLength(UrlEditRuleComponent.PATH_MAXLENGTH),
          ]),
          type: new FormControl(urlRules[0].type, [Validators.required]),
        })
      );
      component.urlMatchRuleFormArray.push(
        new FormGroup({
          path: new FormControl(urlRules[1].path, [
            Validators.required,
            Validators.maxLength(UrlEditRuleComponent.PATH_MAXLENGTH),
          ]),
          type: new FormControl(urlRules[1].type, [Validators.required]),
        })
      );
      component.urlMatchRuleFormArray.push(
        new FormGroup({
          path: new FormControl(urlRules[2].path, [
            Validators.required,
            Validators.maxLength(UrlEditRuleComponent.PATH_MAXLENGTH),
          ]),
          type: new FormControl(urlRules[2].type, [Validators.required]),
        })
      );
      component.deleteUrlEditRuleHandler(0);
      expect(component.urlMatchRuleFormArray.length).toBe(2);
    });
  });

  describe('UrlEditRuleComponent.addUrlEditRuleHandler', () => {
    it('should save valid url rule', () => {
      const urlRule: UrlRule = {
        type: faker.datatype.number({
          min: 0,
          max: Object.keys(RuleType).length - 1,
        }),
        path: faker.random.word(),
      };
      const urlRulesFormGroup = new FormGroup({
        path: new FormControl(urlRule.path, [
          Validators.required,
          Validators.maxLength(UrlEditRuleComponent.PATH_MAXLENGTH),
        ]),
        type: new FormControl(urlRule.type, [Validators.required]),
      });
      component.urlMatchRuleFormArray.push(urlRulesFormGroup);
      expect(component.urlMatchRuleFormArray.length).toBe(1);
      expect(component.urlMatchRuleFormArray.at(0)).toEqual(urlRulesFormGroup);
    });
  });

  it('should not save repeated url rule', () => {
    const urlRule: UrlRule = {
      type: faker.datatype.number({
        min: 0,
        max: Object.keys(RuleType).length - 1,
      }),
      path: faker.random.word(),
    };
    const urlRulesFormGroup = new FormGroup({
      path: new FormControl(urlRule.path, [
        Validators.required,
        Validators.maxLength(UrlEditRuleComponent.PATH_MAXLENGTH),
      ]),
      type: new FormControl(urlRule.type, [Validators.required]),
    });
    component.urlMatchRuleFormArray.push(urlRulesFormGroup);
    component.addUrlEditRuleHandler(urlRule);
    expect(component.urlMatchRuleFormArray.length).toBe(1);
    expect(component.urlMatchRuleFormArray.at(0)).toEqual(urlRulesFormGroup);
  });
});
