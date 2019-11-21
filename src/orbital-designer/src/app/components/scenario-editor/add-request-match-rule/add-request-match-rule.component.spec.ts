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
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as faker from 'faker';
import { KvpAddComponent } from '../../orbital-common/kvp-edit/kvp-add/kvp-add.component';
import { KvpEditComponent } from '../../orbital-common/kvp-edit/kvp-edit.component';
import { KvpListItemComponent } from '../../orbital-common/kvp-edit/kvp-list-item/kvp-list-item.component';
import { RequestMatchRule } from 'src/app/models/mock-definition/scenario/request-match-rule.model';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import { BodyRuleType } from 'src/app/models/mock-definition/scenario/body-rule.type';
import { AddBodyRuleContainerComponent } from '../add-body-rule-container/add-body-rule-container.component';
import { AddBodyRuleComponent } from '../add-body-rule-container/add-body-rule/add-body-rule.component';
import { BodyRuleListItemComponent } from '../add-body-rule-container/body-rule-list-item/body-rule-list-item.component';

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
        AddBodyRuleContainerComponent,
        AddBodyRuleComponent,
        BodyRuleListItemComponent
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
        MatCheckboxModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRequestMatchRuleComponent);
    component = fixture.componentInstance;

    component.requestMatchRule = ({
      headerRules: new Map<string, string>(),
      queryRules: new Map<string, string>(),
      bodyRules: [{}] as BodyRule[]
    } as unknown) as RequestMatchRule;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('add-request-match-rule.handleHeaderKvpOutput', () => {
    it('should set the header match rules if it is truthy', () => {
      const headerMatchRules = new Map<string, string>();
      headerMatchRules.set(faker.random.word(), faker.random.word());
      component.handleHeaderKvpOutput(headerMatchRules);
      expect(component.headerMatchRules).toEqual(headerMatchRules);
    });
  });

  describe('add-request-match-rule.handleQueryKvpOutput', () => {
    it('should set the query match rules if it is truthy', () => {
      const queryMatchRules = new Map<string, string>();
      queryMatchRules.set(faker.random.word(), faker.random.word());
      component.handleQueryKvpOutput(queryMatchRules);
      expect(component.queryMatchRules).toEqual(queryMatchRules);
    });
  });

  describe('add-request-match-rule.handleBodyOutput', () => {
    it('should set the body match rules if it is truthy', () => {
      const bodyMatchRules = [
        { type: BodyRuleType.BodyEquality, rule: { a: faker.random.word() } }
      ] as BodyRule[];
      component.handleBodyOutput(bodyMatchRules);
      expect(component.bodyMatchRules).toEqual(bodyMatchRules);
    });
  });

  describe('AddRequestMatchRule.Save', () => {
    it('should not emit the request match rules if the header match rules are invalid', () => {
      const testQueryMatchRules = new Map<string, string>();
      const testHeaderMatchRules = null;
      const testBodyMatchRules: BodyRule[] = [{}] as BodyRule[];

      testQueryMatchRules.set(faker.random.word(), faker.random.word());
      component.requestMatchRule.headerRules = testHeaderMatchRules;
      testBodyMatchRules[0].rule = { a: faker.random.word() };
      testBodyMatchRules[0].type = BodyRuleType.BodyEquality;

      spyOn(component.requestMatchRuleOutput, 'emit');
      component.saveStatus = true;

      expect(component.requestMatchRuleOutput.emit).not.toHaveBeenCalled();
    });

    it('should not emit the request match rules if the query match rules are invalid', () => {
      const testHeaderMatchRules = new Map<string, string>();
      const testBodyMatchRules: BodyRule[] = [{}] as BodyRule[];

      testHeaderMatchRules.set(faker.random.word(), faker.random.word());
      testBodyMatchRules[0].rule = { a: faker.random.word() };
      testBodyMatchRules[0].type = BodyRuleType.BodyEquality;

      spyOn(component.requestMatchRuleOutput, 'emit');

      const requestMatchRule = {
        headerRules: testHeaderMatchRules,
        queryRules: undefined,
        bodyRules: testBodyMatchRules
      } as RequestMatchRule;
      component.requestMatchRule = requestMatchRule;
      component.saveStatus = true;

      expect(component.requestMatchRuleOutput.emit).not.toHaveBeenCalled();
    });

    it('should not emit the request match rules if the body match rules are invalid', () => {
      const testHeaderMatchRules = new Map<string, string>();
      const testQueryMatchRules = new Map<string, string>();

      testHeaderMatchRules.set(faker.random.word(), faker.random.word());
      testQueryMatchRules.set(faker.random.word(), faker.random.word());

      spyOn(component.requestMatchRuleOutput, 'emit');

      component.headerMatchRules = testHeaderMatchRules;
      component.queryMatchRules = testQueryMatchRules;
      const requestMatchRule = {
        headerRules: testHeaderMatchRules,
        queryRules: testQueryMatchRules,
        bodyRules: undefined
      } as RequestMatchRule;
      component.requestMatchRule = requestMatchRule;
      component.saveStatus = true;

      expect(component.requestMatchRuleOutput.emit).not.toHaveBeenCalled();
    });
  });
});
