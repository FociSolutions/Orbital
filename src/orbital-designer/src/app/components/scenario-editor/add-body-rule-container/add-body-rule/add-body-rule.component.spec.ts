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
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import * as faker from 'faker';
import { GetRuleTypeStringPipe } from 'src/app/pipes/get-rule-type-string/get-rule-type-string.pipe';

describe('AddBodyRuleComponent', () => {
  let component: AddBodyRuleComponent;
  let fixture: ComponentFixture<AddBodyRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddBodyRuleComponent, GetRuleTypeStringPipe],
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
    return [
      { testkey: faker.random.word(), testobjattr: faker.random.word() },
      { testkey2: faker.random.word(), testobjattr2: faker.random.word() }
    ];
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

        it('should emit the body rule when it is added', () => {
          const fakeRule = { a: faker.random.word() };
          const Expected = {
            type: RuleType.JSONCONTAINS,
            rule: fakeRule
          } as BodyRule;
          const bodyRuleOutputSpy = spyOn(component.bodyRuleOutput, 'emit');
          component.bodyType = RuleType.JSONCONTAINS;
          component.bodyValue = JSON.stringify(fakeRule);
          component.addBodyRule();

          expect(bodyRuleOutputSpy).toHaveBeenCalledWith(Expected);
          expect(component.bodyType).toBe(null);
        });
      });
    });

    describe('add invalid rule(s)', () => {
      describe('invalid json', () => {
        it('should not add a rule when an invalid rule is added to an empty list of rules', () => {
          component.bodyValue = 'invalid';
          component.bodyType = RuleType.JSONEQUALITY;
          expect(component.bodyRules).toEqual([]);
        });

        it('should show the invalid JSON error when invalid JSON is set', () => {
          component.bodyValue = 'invalid';
          component.bodyType = RuleType.JSONEQUALITY;
          component.addBodyRule();
          expect(component.errorMessage).toEqual(
            'The body value must be valid JSON'
          );
        });
      });
    });
  });
});
