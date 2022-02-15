import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerTestingModule } from 'ngx-logger/testing/';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BodyAddRuleComponent } from './body-add-rule.component';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule/body-rule.model';
import { BodyRuleType } from 'src/app/models/mock-definition/scenario/body-rule/body-rule.type';
import { JsonRuleCondition } from 'src/app/models/mock-definition/scenario/body-rule/rule-condition/json.condition';
import { JsonEditorComponent } from 'ang-jsoneditor';

describe('BodyAddRuleComponent', () => {
  let component: BodyAddRuleComponent;
  let fixture: ComponentFixture<BodyAddRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BodyAddRuleComponent, JsonEditorComponent],
      imports: [
        BrowserAnimationsModule,
        LoggerTestingModule,
        MatInputModule,
        MatIconModule,
        MatSelectModule,
        MatCardModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BodyAddRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('When form group is made', () => {
    it('should have a rule from control', () => {
      expect(component.rule).toBeTruthy();
    });

    it('should have a type from control', () => {
      expect(component.ruleType).toBeTruthy();
    });
  });

  describe('When the type is JSONEQUALITY', () => {
    beforeEach(() => {
      component.ruleType.setValue(BodyRuleType.JSON);
      component.ruleCondition.setValue(JsonRuleCondition.EQUALITY);
    });

    describe('And rule has not been set to a value', () => {
      it('should have rule set to INVALID status', () => {
        expect(component.rule.status).toBe('INVALID');
      });
    });

    describe('And rule has been set to a value', () => {
      beforeEach(() => {
        component.rule.setValue('{"x":"y"}');
      });
      it('should have rule set to VALID status', () => {
        expect(component.rule.status).toBe('VALID');
      });

      describe('And the add button is pushed', () => {
        it('Should emit the bodyRuleAddedEventEmitter', (done) => {
          component.bodyRuleAddedEventEmitter.subscribe((bodyRule: BodyRule) => {
            expect(bodyRule).toEqual({
              rule: '{"x":"y"}',
              ruleType: BodyRuleType.JSON,
              ruleCondition: JsonRuleCondition.EQUALITY,
            } as unknown as BodyRule);
            done();
          });

          component.addBodyRule();
        });
      });
    });
  });
});
