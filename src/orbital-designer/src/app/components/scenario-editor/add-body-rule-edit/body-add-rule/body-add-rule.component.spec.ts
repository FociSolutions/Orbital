import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerTestingModule } from 'ngx-logger/testing/';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { BodyAddRuleComponent } from './body-add-rule.component';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';

describe('BodyAddRuleComponent', () => {
  let component: BodyAddRuleComponent;
  let fixture: ComponentFixture<BodyAddRuleComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [BodyAddRuleComponent],
      imports: [
        BrowserAnimationsModule,
        LoggerTestingModule,
        MatInputModule,
        MatIconModule,
        MatSelectModule,
        MatCardModule,
        FormsModule,
        ReactiveFormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BodyAddRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('When form group is made', () => {
    it('should have a rule from control', () => {
      expect(component.rule).toBeTruthy();
    });

    it('should have a type from control', () => {
      expect(component.type).toBeTruthy();
    });
  });

  describe('When the type is JSONEQUALITY', () => {
    beforeEach(() => {
      component.type.setValue(RuleType.JSONEQUALITY);
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
        it('Should emit the bodyRuleAddedEventEmitter', done => {
          component.bodyRuleAddedEventEmitter.subscribe((bodyRule: BodyRule) => {
            expect(bodyRule).toEqual(({ rule: '{"x":"y"}', type: RuleType.JSONEQUALITY } as unknown) as BodyRule);
            done();
          });

          component.addBodyRule();
        });
      });
    });
  });
});
