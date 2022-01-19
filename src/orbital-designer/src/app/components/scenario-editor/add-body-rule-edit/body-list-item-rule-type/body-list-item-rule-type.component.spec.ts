import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { RuleType } from '../../../../models/mock-definition/scenario/rule.type';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BodyListItemRuleTypeComponent } from './body-list-item-rule-type.component';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';

describe('BodyListItemRuleTypeComponent', () => {
  let component: BodyListItemRuleTypeComponent;
  let fixture: ComponentFixture<BodyListItemRuleTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
      declarations: [BodyListItemRuleTypeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BodyListItemRuleTypeComponent);
    component = fixture.componentInstance;
    component.bodyEditRuleFormGroup = new FormGroup({
      rule: new FormControl('', [Validators.required]),
      type: new FormControl(RuleType.NONE, [Validators.required]),
    });
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
      expect(component.type).toBeTruthy();
    });
  });

  describe('When the type is JSONEQUALITY', () => {
    beforeEach(() => {
      component.type.setValue(RuleType.JSONEQUALITY);
    });

    describe('And rule has been set to a value', () => {
      beforeEach(() => {
        component.rule.setValue('{"x":"y"}');
      });
      it('should have rule set to VALID status', () => {
        expect(component.rule.status).toBe('VALID');
      });

      describe('And the remove button is pushed', () => {
        it('Should emit the bodyRuleRemovedEventEmitter', (done) => {
          component.bodyRuleRemovedEventEmitter.subscribe((body: BodyRule) => {
            expect(body.rule).toEqual({ bodyrule: '{"x":"y"}' });
            done();
          });

          component.onRemove();
        });
      });
    });
  });
});
