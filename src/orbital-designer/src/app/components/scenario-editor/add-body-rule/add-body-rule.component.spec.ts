import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { AddBodyRuleComponent } from './add-body-rule.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule, MatIconModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import { BodyRuleType } from 'src/app/models/mock-definition/scenario/body-rule.type';
import * as faker from 'faker';

describe('AddBodyRuleComponent', () => {
  let component: AddBodyRuleComponent;
  let fixture: ComponentFixture<AddBodyRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddBodyRuleComponent],
      imports: [
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        LoggerTestingModule,
        MatIconModule,
        FormsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBodyRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Generates a fake json object to be used for the response body rule
   */
  function getFakeBodyContents() {
    return [{testkey: faker.random.word(), testobjattr: faker.random.word()},
      {testkey2: faker.random.word(), testobjattr2: faker.random.word()}];
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('add-body-rule.addBodyRule', () => {
    describe('add valid rule(s)', () => {
      describe('non-empty and empty lists', () => {
        it('should disallow entering in an empty rule when the component is initialized', () => {
          const Expected = [] as BodyRule[];
          component.addBodyRule();
          const Actual = component.bodyRules;
          expect(Expected).toEqual(Actual);
        });

        it('should add a valid empty json rule to an empty list of rules', () => {
          component.bodyValue = '{}';
          component.bodyType = BodyRuleType.BodyEquality;

          const Expected = [{type: BodyRuleType.BodyEquality, rule: {}}] as BodyRule[];
          component.addBodyRule();
          const Actual = component.bodyRules;
          expect(Expected).toEqual(Actual);
        });

        it('should add a valid non-empty json rule to an empty list of rules', () => {
          const fakeBodyContents = getFakeBodyContents();
          component.bodyValue = JSON.stringify(fakeBodyContents);
          component.bodyType = BodyRuleType.BodyEquality;
          component.addBodyRule();

          const Expected = [{type: BodyRuleType.BodyEquality, rule: fakeBodyContents}] as BodyRule[];
          const Actual = component.bodyRules;
          expect(Expected).toEqual(Actual);
        });

        it('should add a valid rule to a non-empty list of rules which are not the same as the added rule', () => {
          const fakeBodyContentsFirst = getFakeBodyContents();
          const fakeBodyContentsSecond = getFakeBodyContents();
          component.bodyValue = JSON.stringify(fakeBodyContentsFirst);
          component.bodyType = BodyRuleType.BodyEquality;
          component.addBodyRule();

          component.bodyValue = JSON.stringify(fakeBodyContentsSecond);
          component.bodyType = BodyRuleType.BodyContains;
          component.addBodyRule();

          const Expected = [{type: BodyRuleType.BodyEquality, rule: fakeBodyContentsFirst},
                            {type: BodyRuleType.BodyContains, rule: fakeBodyContentsSecond}] as BodyRule[];
          const Actual = component.bodyRules;
          expect(Expected).toEqual(Actual);
        });
      });
    });

    describe('add invalid rule(s)', () => {
      describe('invalid rule', () => {
        it('should not add a rule if it already exists', () => {
          const fakeBodyContents = getFakeBodyContents();
          component.bodyValue = JSON.stringify(fakeBodyContents);
          component.bodyType = BodyRuleType.BodyEquality;
          component.addBodyRule();

          component.bodyValue = JSON.stringify(fakeBodyContents);
          component.bodyType = BodyRuleType.BodyEquality;
          component.addBodyRule();

          expect(component.errorMessage).toEqual('The rule already exists');
        });
      });

      describe('invalid json', () => {
        it('should not add a rule when an invalid rule is added to an empty list of rules', () => {
          component.bodyValue = 'invalid';
          component.bodyType = BodyRuleType.BodyEquality;
          expect(component.bodyRules).toEqual([]);
        });

        it('should show the invalid JSON error when invalid JSON is set', () => {
          component.bodyValue = 'invalid';
          component.bodyType = BodyRuleType.BodyEquality;
          component.addBodyRule();
          expect(component.errorMessage).toEqual('The body value must be valid JSON');
        });
      });
    });
  });

  describe('add-body-rule.isValidJSON', () => {
    it('should return false if the JSON cannot be parsed ', () => {
      const Actual = component.isValidJSON('invalid');
      expect(Actual).toBe(false);
    });
  });

  describe('add-body-rule.tryParseJSON', () => {
    it('should return null if the JSON cannot be parsed ', () => {
      const Actual = component.tryParseJSON('invalid');
      expect(Actual).toBe(null);
    });
  });
});
