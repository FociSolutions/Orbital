import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { AddBodyRuleComponent } from './add-body-rule.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule, MatIconModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { BodyRuleType } from 'src/app/models/mock-definition/scenario/body-rule.type';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';

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
        MatIconModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBodyRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

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
          component.addBodyRuleFormGroup.get('bodyValue').setValue('{}');
          component.addBodyRuleFormGroup.get('bodyType').setValue('bodyEquality');

          const Expected = [{type: BodyRuleType.BodyEquality, rule: {}}] as BodyRule[];
          component.addBodyRule();
          const Actual = component.bodyRules;
          expect(Expected).toEqual(Actual);
        });

        it('should add a valid non-empty json rule to an empty list of rules', () => {
          component.addBodyRuleFormGroup.get('bodyValue').setValue('{"a": "b"}');
          component.addBodyRuleFormGroup.get('bodyType').setValue('bodyEquality');
          component.addBodyRule();

          const Expected = [{type: BodyRuleType.BodyEquality, rule: {a: 'b'}}] as BodyRule[];
          const Actual = component.bodyRules;
          expect(Expected).toEqual(Actual);
        });

        it('should add a valid rule to a non-empty list of rules which are not the same as the added rule', () => {
          component.addBodyRuleFormGroup.get('bodyValue').setValue('{"a": "b"}');
          component.addBodyRuleFormGroup.get('bodyType').setValue('bodyEquality');
          component.addBodyRule();

          component.addBodyRuleFormGroup.get('bodyValue').setValue('{"c": "d"}');
          component.addBodyRuleFormGroup.get('bodyType').setValue('bodyContains');
          component.addBodyRule();

          const Expected = [{type: BodyRuleType.BodyEquality, rule: {a: 'b'}},
                            {type: BodyRuleType.BodyContains, rule: {c: 'd'}}] as BodyRule[];
          const Actual = component.bodyRules;
          expect(Expected).toEqual(Actual);
        });
      });
    });

    describe('add invalid rule(s)', () => {
      describe('invalid json', () => {
        it('should throw a validation error when an invalid rule is added to an empty list of rules', () => {
          component.addBodyRuleFormGroup.get('bodyValue').setValue('invalid');
          component.addBodyRuleFormGroup.get('bodyType').setValue('bodyEquality');
          expect(component.addBodyRuleFormGroup.errors).not.toBeTruthy();
        });

        it('should not add a rule when an invalid rule is added to an empty list of rules', () => {
          component.addBodyRuleFormGroup.get('bodyValue').setValue('invalid');
          component.addBodyRuleFormGroup.get('bodyType').setValue('bodyEquality');
          expect(component.bodyRules).toEqual([]);
        });
      });

      describe('duplicate rule', () => {
        it('should throw a validation error when adding an invalid rule to an empty list of rules', () => {
          component.addBodyRuleFormGroup.get('bodyValue').setValue('{"a": "b"}');
          component.addBodyRuleFormGroup.get('bodyType').setValue('bodyEquality');
          component.addBodyRule();

          component.addBodyRuleFormGroup.get('bodyValue').setValue('{"a": "b"}');
          component.addBodyRuleFormGroup.get('bodyType').setValue('bodyEquality');
          component.addBodyRule();
          expect(component.addBodyRuleFormGroup.errors).toEqual(null);
        });
      });
    });
  });
});
