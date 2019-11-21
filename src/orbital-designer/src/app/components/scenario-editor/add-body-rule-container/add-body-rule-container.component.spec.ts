import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { AddBodyRuleContainerComponent } from './add-body-rule-container.component';
import { AddBodyRuleComponent } from './add-body-rule/add-body-rule.component';
import { BodyRuleListItemComponent } from './body-rule-list-item/body-rule-list-item.component';
import {
  MatFormFieldModule,
  MatInputModule,
  MatCardModule,
  MatIconModule
} from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import * as faker from 'faker';
import { BodyRuleType } from 'src/app/models/mock-definition/scenario/body-rule.type';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';

describe('AddBodyRuleContainerComponent', () => {
  let component: AddBodyRuleContainerComponent;
  let fixture: ComponentFixture<AddBodyRuleContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddBodyRuleContainerComponent,
        AddBodyRuleComponent,
        BodyRuleListItemComponent,
        BodyRuleListItemComponent
      ],
      imports: [
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCardModule,
        MatIconModule,
        FormsModule,
        BrowserAnimationsModule,
        LoggerTestingModule,
        MatDividerModule,
        MatCheckboxModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBodyRuleContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.bodyRulesProp = [] as BodyRule[];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('add-body-rule-container.addBodyRule', () => {
    it('should add a body rule', () => {
      const bodyRuleToAdd = {
        type: BodyRuleType.BodyEquality,
        rule: { a: 'b' }
      } as BodyRule;
      component.addBodyRule(bodyRuleToAdd);
      const Actual = component.bodyRulesProp;
      expect([bodyRuleToAdd]).toEqual(Actual);
    });

    it('should not add an empty body rule', () => {
      const bodyRuleToAdd = {} as BodyRule;
      component.addBodyRule(bodyRuleToAdd);
      const Actual = component.bodyRulesProp;
      expect(Actual.length).toBe(0);
    });

    it('should not add a body rule which has an undefined rule', () => {
      const bodyRuleToAdd = ({
        rule: undefined,
        type: BodyRuleType.BodyContains
      } as unknown) as BodyRule;
      component.addBodyRule(bodyRuleToAdd);
      const Actual = component.bodyRulesProp;
      expect(Actual).toEqual([] as BodyRule[]);
    });

    it('should not add a body rule which has an undefined type', () => {
      const bodyRuleToAdd = ({
        rule: {},
        type: undefined
      } as unknown) as BodyRule;
      component.addBodyRule(bodyRuleToAdd);
      const Actual = component.bodyRulesProp;
      expect(Actual).toEqual([] as BodyRule[]);
    });

    it('should delete a body rule when a delete body rule event is emitted', () => {
      const fakeBodyContents = getFakeBodyContents();
      component.bodyRulesProp = [] as BodyRule[];

      const componentBodyRule = [
        { type: BodyRuleType.BodyEquality, rule: fakeBodyContents }
      ] as BodyRule[];
      component.bodyRulesProp.push(componentBodyRule[0]);

      component.handleDeleteBodyRule(componentBodyRule[0]);
      expect(component.bodyRulesProp.length).toBe(0);
    });

    it('should not delete a body rule when the body rule to delete is invalid', () => {
      const fakeBodyContents = getFakeBodyContents();

      const componentBodyRule = {
        type: BodyRuleType.BodyEquality,
        rule: fakeBodyContents
      } as BodyRule;
      component.bodyRulesProp = [componentBodyRule];

      component.handleDeleteBodyRule(undefined);

      expect(component.bodyRulesProp.length).toEqual(1);
    });
  });

  describe('bodyRules', () => {
    it('should not save when list is null', () => {
      component.bodyRules = null;
      expect(component.bodyRulesProp).toEqual([]);
    });

    it('should save list', () => {
      const input = [
        { type: BodyRuleType.BodyEquality, rule: getFakeBodyContents() }
      ] as BodyRule[];

      component.bodyRules = input;
      expect(component.bodyRulesProp.length).toEqual(1);
    });
  });

  describe('saveBodyRules', () => {
    it('should emit the body rules when the save state is true', () => {
      const fakeBodyContents = getFakeBodyContents();
      const componentBodyRule = [
        { type: BodyRuleType.BodyEquality, rule: fakeBodyContents }
      ] as BodyRule[];
      component.addBodyRule(componentBodyRule[0]);

      spyOn(component.bodyRulesOutput, 'emit');
      component.saveBodyRules = true;

      expect(component.bodyRulesOutput.emit).toHaveBeenCalledWith(
        componentBodyRule
      );
    });

    it('should not emit the body rules when the save state is false', () => {
      const fakeBodyContents = getFakeBodyContents();
      const componentBodyRule = [
        { type: BodyRuleType.BodyEquality, rule: fakeBodyContents }
      ] as BodyRule[];
      component.addBodyRule(componentBodyRule[0]);

      spyOn(component.bodyRulesOutput, 'emit');
      component.saveBodyRules = false;

      expect(component.bodyRulesOutput.emit).not.toHaveBeenCalledWith(
        componentBodyRule
      );
    });
  });

  /*
   * Generates a fake json object to be used for the response body rul
   */
  function getFakeBodyContents() {
    return [
      { testkey: faker.random.word(), testobjattr: faker.random.word() },
      { testkey2: faker.random.word(), testobjattr2: faker.random.word() }
    ];
  }
});
