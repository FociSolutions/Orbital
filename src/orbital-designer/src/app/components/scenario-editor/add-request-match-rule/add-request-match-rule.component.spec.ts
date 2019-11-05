import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { AddRequestMatchRuleComponent } from './add-request-match-rule.component';
import { MatExpansionModule, MatFormFieldModule, MatInputModule,
  MatSelectModule, MatCardModule, MatDividerModule, MatIconModule, MatCheckboxModule } from '@angular/material';
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
        BodyRuleListItemComponent ],
      imports: [ LoggerTestingModule,
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
        MatCheckboxModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRequestMatchRuleComponent);
    component = fixture.componentInstance;

    component.requestMatchRule =
      {headerRules: new Map<string, string>(), queryRules: new Map<string, string>(),
       bodyRules: [{}] as BodyRule[]} as unknown as RequestMatchRule;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('add-request-match-rule.cannotClose', () => {
    it('should initialize the component to a valid save status and can close accordion', () => {
      expect(component.cannotClose()).toBe(false);
    });
  });

  describe('add-request-match-rule.handleHeaderKvpOutput', () => {
    it('should set the header match rules if it is truthy', () => {
      const headerMatchRules = new Map<string, string>();
      headerMatchRules.set(faker.random.word(), faker.random.word());
      component.handleHeaderKvpOutput(headerMatchRules);
      expect(component.headerMatchRules).toEqual(headerMatchRules);
    });

    it('should not set the header match rules if it is not truthy', () => {
      const headerMatchRules = null;
      component.handleHeaderKvpOutput(headerMatchRules);
      expect(component.headerMatchRules).toEqual(undefined);
    });
  });

  describe('add-request-match-rule.handleQueryKvpOutput', () => {
    it('should set the query match rules if it is truthy', () => {
      const queryMatchRules = new Map<string, string>();
      queryMatchRules.set(faker.random.word(), faker.random.word());
      component.handleQueryKvpOutput(queryMatchRules);
      expect(component.queryMatchRules).toEqual(queryMatchRules);
    });

    it('should not set the query match rules if it is not truthy', () => {
      const queryMatchRules = null;
      component.handleQueryKvpOutput(queryMatchRules);
      expect(component.queryMatchRules).toEqual(undefined);
    });
  });

  describe('add-request-match-rule.handleBodyOutput', () => {
    it('should set the body match rules if it is truthy', () => {
      const bodyMatchRules = [{type: BodyRuleType.BodyEquality, rule: {a: faker.random.word()}}] as BodyRule[];
      component.handleBodyOutput(bodyMatchRules);
      expect(component.bodyMatchRules).toEqual(bodyMatchRules);
    });
  });

  describe('add-request-match-rule.canCollapseCard setter', () => {
    it('should disable the card and set it to expanded if the card cannot be collapsed', () => {
      component.canCollapseCard = true;
      expect(component.isCardDisabled).toBe(false);
    });

    it('should initialize the card\'s expandability to undefined when initializing', () => {
      component.canCollapseCard = true;
      expect(component.panelExpanded).toBe(undefined);
    });

    it('should disable the card if the card cannot be collapsed', () => {
      component.canCollapseCard = false;
      expect(component.isCardDisabled).toBe(true);
    });

    it('should expand the card if the card cannot be collapsed', () => {
      component.canCollapseCard = false;
      expect(component.panelExpanded).toBe(true);
    });

    it('should emit false for isValid if the card cannot be collapsed', () => {
      spyOn(component.isValid, 'emit');
      component.canCollapseCard = false;
      expect(component.isValid.emit).toHaveBeenCalledWith(false);
    });

    it('should emit true for isValid if the card can be collapsed', () => {
      spyOn(component.isValid, 'emit');
      component.canCollapseCard = true;
      expect(component.isValid.emit).toHaveBeenCalledWith(true);
    });
  });

  describe('AddRequestMatchRule.Save', () => {
    it('should emit the request match rules if they are valid', () => {
      const testHeaderMatchRules = new Map<string, string>();
      const testQueryMatchRules = new Map<string, string>();
      const testBodyMatchRules: BodyRule[] = [{}] as BodyRule[];

      testHeaderMatchRules.set(faker.random.word(), faker.random.word());
      testQueryMatchRules.set(faker.random.word(), faker.random.word());
      testBodyMatchRules[0].rule = {a: faker.random.word()};
      testBodyMatchRules[0].type = BodyRuleType.BodyEquality;

      spyOn(component.requestMatchRuleOutput, 'emit');
      spyOn(component.isValid, 'emit');

      const requestMatchRule = { headerRules: testHeaderMatchRules,
                         queryRules: testQueryMatchRules,
                         bodyRules: testBodyMatchRules } as RequestMatchRule;
      component.requestMatchRule = requestMatchRule;
      component.saveStatus = true;

      expect(component.requestMatchRuleOutput.emit).toHaveBeenCalledWith(requestMatchRule);
      expect(component.isValid.emit).toHaveBeenCalledWith(true);
    });

    it('should not emit the request match rules if the header match rules are invalid', () => {
      const testQueryMatchRules = new Map<string, string>();
      const testHeaderMatchRules = null;
      const testBodyMatchRules: BodyRule[] = [{}] as BodyRule[];

      testQueryMatchRules.set(faker.random.word(), faker.random.word());
      component.requestMatchRule.headerRules = testHeaderMatchRules;
      testBodyMatchRules[0].rule = {a: faker.random.word()};
      testBodyMatchRules[0].type = BodyRuleType.BodyEquality;

      spyOn(component.requestMatchRuleOutput, 'emit');
      spyOn(component.isValid, 'emit');
      component.saveStatus = true;

      expect(component.requestMatchRuleOutput.emit).not.toHaveBeenCalled();
      expect(component.isValid.emit).not.toHaveBeenCalled();
    });

    it('should not emit the request match rules if the query match rules are invalid', () => {
      const testHeaderMatchRules = new Map<string, string>();
      const testBodyMatchRules: BodyRule[] = [{}] as BodyRule[];

      testHeaderMatchRules.set(faker.random.word(), faker.random.word());
      testBodyMatchRules[0].rule = {a: faker.random.word()};
      testBodyMatchRules[0].type = BodyRuleType.BodyEquality;

      spyOn(component.requestMatchRuleOutput, 'emit');
      spyOn(component.isValid, 'emit');

      const requestMatchRule = { headerRules: testHeaderMatchRules,
                         queryRules: undefined,
                         bodyRules: testBodyMatchRules } as RequestMatchRule;
      component.requestMatchRule = requestMatchRule;
      component.saveStatus = true;

      expect(component.requestMatchRuleOutput.emit).not.toHaveBeenCalled();
      expect(component.isValid.emit).not.toHaveBeenCalled();
    });

    it('should not emit the request match rules if the body match rules are invalid', () => {
      const testHeaderMatchRules = new Map<string, string>();
      const testQueryMatchRules = new Map<string, string>();

      testHeaderMatchRules.set(faker.random.word(), faker.random.word());
      testQueryMatchRules.set(faker.random.word(), faker.random.word());

      spyOn(component.requestMatchRuleOutput, 'emit');
      spyOn(component.isValid, 'emit');

      const requestMatchRule = { headerRules: testHeaderMatchRules,
                         queryRules: testQueryMatchRules,
                         bodyRules: undefined } as RequestMatchRule;
      component.requestMatchRule = requestMatchRule;
      component.saveStatus = true;

      expect(component.requestMatchRuleOutput.emit).not.toHaveBeenCalled();
      expect(component.isValid.emit).not.toHaveBeenCalled();
    });
  });
});
