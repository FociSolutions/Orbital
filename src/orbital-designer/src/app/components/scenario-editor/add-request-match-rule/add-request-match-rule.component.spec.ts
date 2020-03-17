import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { AddRequestMatchRuleComponent } from './add-request-match-rule.component';
import {
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatCardModule,
  MatDividerModule,
  MatIconModule,
  MatCheckboxModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as faker from 'faker';
import { KvpAddComponent } from '../../orbital-common/kvp-edit/kvp-add/kvp-add.component';
import { KvpEditComponent } from '../../orbital-common/kvp-edit/kvp-edit.component';
import { KvpListItemComponent } from '../../orbital-common/kvp-edit/kvp-list-item/kvp-list-item.component';
import { RequestMatchRule } from 'src/app/models/mock-definition/scenario/request-match-rule.model';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { KeyValuePairRule } from 'src/app/models/mock-definition/scenario/key-value-pair-rule.model';
import { KvpEditRuleComponent } from '../kvp-edit-rule/kvp-edit-rule.component';
import { KvpListItemRuleTypeComponent } from '../kvp-edit-rule/kvp-list-item-rule-type/kvp-list-item-rule-type.component';
import { GetRuleTypeStringPipe } from 'src/app/pipes/get-rule-type-string/get-rule-type-string.pipe';
import { KvpAddRuleComponent } from '../kvp-edit-rule/kvp-add-rule/kvp-add-rule.component';
import { UrlAddRuleComponent } from '../url-edit-rule/url-add-rule/url-add-rule.component';
import { UrlEditRuleComponent } from '../url-edit-rule/url-edit-rule.component';
import { UrlListItemRuleTypeComponent } from '../url-edit-rule/url-list-item-rule-type/url-list-item-rule-type.component';
import { DesignerStore } from 'src/app/store/designer-store';
import { ScenarioFormBuilder } from '../scenario-form-builder/scenario-form.builder';
import { BodyEditRuleComponent } from '../add-body-rule-edit/body-edit-rule.component';
import { BodyListItemRuleTypeComponent } from '../add-body-rule-edit/body-list-item-rule-type/body-list-item-rule-type.component';
import { BodyAddRuleComponent } from '../add-body-rule-edit/body-add-rule/body-add-rule.component';

describe('AddRequestMatchRuleComponent', () => {
  let component: AddRequestMatchRuleComponent;
  let fixture: ComponentFixture<AddRequestMatchRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddRequestMatchRuleComponent,
        KvpAddComponent,
        KvpEditComponent,
        KvpListItemComponent,
        KvpEditRuleComponent,
        KvpListItemRuleTypeComponent,
        GetRuleTypeStringPipe,
        KvpAddRuleComponent,
        UrlAddRuleComponent,
        UrlEditRuleComponent,
        UrlListItemRuleTypeComponent,
        BodyEditRuleComponent,
        BodyListItemRuleTypeComponent,
        BodyAddRuleComponent
      ],
      imports: [
        LoggerTestingModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCardModule,
        FormsModule,
        BrowserAnimationsModule,
        LoggerTestingModule,
        MatDividerModule,
        MatIconModule,
        MatCheckboxModule,
        ReactiveFormsModule
      ],
      providers: [DesignerStore, ScenarioFormBuilder]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRequestMatchRuleComponent);
    component = fixture.componentInstance;

    const scenarioFormBuilder = TestBed.get(ScenarioFormBuilder) as ScenarioFormBuilder;
    const scenarioForm = scenarioFormBuilder.createNewScenarioForm();
    component.requestMatchRuleFormGroup = scenarioForm.controls.requestMatchRules as FormGroup;

    component.requestMatchRule = ({
      headerRules: [],
      queryRules: [],
      bodyRules: [{}] as BodyRule[]
    } as unknown) as RequestMatchRule;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('AddRequestMatchRule.Save', () => {
    it('should not emit the request match rules if the body match rules are invalid', () => {
      spyOn(component.requestMatchRuleOutput, 'emit');

      const inputInvalidBodyMatchRule: BodyRule[] = [
        {
          type: -1,
          rule: {
            key: faker.lorem.sentence(),
            value: faker.lorem.sentence()
          }
        }
      ];
      const requestMatchRule = {
        bodyRules: inputInvalidBodyMatchRule
      } as RequestMatchRule;
      component.requestMatchRule = requestMatchRule;
      component.saveStatus = true;

      expect(component.requestMatchRuleOutput.emit).not.toHaveBeenCalled();
    });
  });
});
